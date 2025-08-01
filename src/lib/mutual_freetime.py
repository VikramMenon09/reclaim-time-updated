import datetime
from datetime import datetime as dt, timedelta, time
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, Query
from pydantic import BaseModel
import pytz
from functools import lru_cache

app = FastAPI()

# --- Data Models ---
class Event(BaseModel):
    start: str  # ISO format
    end: str    # ISO format
    status: Optional[str] = "busy"  # busy or tentative

class UserCalendar(BaseModel):
    user_id: str
    events: List[Event]
    availability_start: str  # e.g. "08:00"
    availability_end: str    # e.g. "22:00"
    timezone: str = "UTC"

class FreeBlock(BaseModel):
    date: str
    start: str
    end: str
    participants_available: List[str]
    tag: str
    score: Optional[float] = None

# --- Helper Functions ---
def parse_time(t: str) -> time:
    return dt.strptime(t, "%H:%M").time()

def parse_iso(s: str, tz: str) -> dt:
    # Parse ISO and localize to user's timezone
    d = dt.fromisoformat(s)
    if d.tzinfo is None:
        d = pytz.timezone(tz).localize(d)
    return d.astimezone(pytz.UTC)

def daterange(start: dt, end: dt, step: timedelta):
    while start < end:
        yield start
        start += step

# --- Core Algorithm ---
def get_user_busy_blocks(user: UserCalendar) -> Dict[str, List[Dict[str, dt]]]:
    """Return a dict of date -> list of busy intervals in UTC for a user."""
    busy: Dict[str, List[Dict[str, dt]]] = {}
    for event in user.events:
        start = parse_iso(event.start, user.timezone)
        end = parse_iso(event.end, user.timezone)
        day = start.date().isoformat()
        busy.setdefault(day, []).append({
            "start": start,
            "end": end,
            "status": event.status
        })
    return busy

def get_user_availability_blocks(user: UserCalendar, days: List[str]) -> Dict[str, Dict[str, dt]]:
    """Return a dict of date -> {'start': dt, 'end': dt} for user's daily window in UTC."""
    avail: Dict[str, Dict[str, dt]] = {}
    tz = pytz.timezone(user.timezone)
    for day in days:
        d = dt.strptime(day, "%Y-%m-%d")
        start_local = tz.localize(dt.combine(d, parse_time(user.availability_start)))
        end_local = tz.localize(dt.combine(d, parse_time(user.availability_end)))
        avail[day] = {
            "start": start_local.astimezone(pytz.UTC),
            "end": end_local.astimezone(pytz.UTC)
        }
    return avail

def merge_busy_blocks(blocks: List[Dict[str, dt]]) -> List[Dict[str, dt]]:
    """Merge overlapping busy blocks."""
    if not blocks:
        return []
    sorted_blocks = sorted(blocks, key=lambda b: b["start"])
    merged = [sorted_blocks[0]]
    for b in sorted_blocks[1:]:
        last = merged[-1]
        if b["start"] <= last["end"]:
            last["end"] = max(last["end"], b["end"])
            if b.get("status") == "tentative" or last.get("status") == "tentative":
                last["status"] = "tentative"
        else:
            merged.append(b)
    return merged

def invert_busy_to_free(avail: Dict[str, dt], busy: List[Dict[str, dt]], min_block: int = 30) -> List[Dict[str, dt]]:
    """Given availability and busy blocks, return free blocks >= min_block (minutes)."""
    free = []
    start = avail["start"]
    for b in busy:
        if (b["start"] - start).total_seconds() / 60 >= min_block:
            free.append({"start": start, "end": b["start"]})
        start = max(start, b["end"])
    if (avail["end"] - start).total_seconds() / 60 >= min_block:
        free.append({"start": start, "end": avail["end"]})
    return free

def intersect_free_blocks(free_blocks: List[List[Dict[str, dt]]], min_block: int = 30) -> List[Dict[str, Any]]:
    """Intersect free blocks across all users for a day."""
    # Flatten all intervals, mark user
    timeline = []
    for idx, blocks in enumerate(free_blocks):
        for b in blocks:
            timeline.append((b["start"], b["end"], idx))
    timeline.sort()
    # Sweep line to find overlaps
    result = []
    n = len(free_blocks)
    points = []
    for t in timeline:
        points.append((t[0], 1, t[2]))  # start
        points.append((t[1], -1, t[2])) # end
    points.sort()
    active = set()
    last_time = None
    for timepoint, typ, user_idx in points:
        if typ == 1:
            active.add(user_idx)
        else:
            active.discard(user_idx)
        if len(active) == n:
            if last_time is None:
                last_time = timepoint
        else:
            if last_time is not None:
                if (timepoint - last_time).total_seconds() / 60 >= min_block:
                    result.append({"start": last_time, "end": timepoint, "participants": list(range(n))})
                last_time = None
    return result

def tag_block(block, users, user_busy_blocks):
    # Tag as best match, partial, or tentative
    tag = "best match"
    for idx, user in enumerate(users):
        for day, blocks in user_busy_blocks[idx].items():
            for b in blocks:
                if b.get("status") == "tentative":
                    if b["start"] < block["end"] and b["end"] > block["start"]:
                        tag = "tentative"
    return tag

def score_block(block):
    # Score: longer blocks, evening, weekend
    score = (block["end"] - block["start"]).total_seconds() / 60
    start_hour = block["start"].hour
    if start_hour >= 18:
        score += 10
    if block["start"].weekday() >= 5:
        score += 20
    return score

# --- Main Mutual Free Time Function ---
def calculate_mutual_free_time(users: List[UserCalendar], min_block: int = 30) -> List[FreeBlock]:
    # Get all days in range
    all_days = set()
    for user in users:
        for event in user.events:
            all_days.add(parse_iso(event.start, user.timezone).date().isoformat())
            all_days.add(parse_iso(event.end, user.timezone).date().isoformat())
    all_days = sorted(all_days)
    # Get busy and availability blocks
    user_busy_blocks = [get_user_busy_blocks(user) for user in users]
    user_avail_blocks = [get_user_availability_blocks(user, all_days) for user in users]
    results = []
    for day in all_days:
        # For each user, get merged busy blocks and free blocks for this day
        user_free_blocks = []
        for idx, user in enumerate(users):
            avail = user_avail_blocks[idx].get(day)
            busy = merge_busy_blocks(user_busy_blocks[idx].get(day, []))
            free = invert_busy_to_free(avail, busy, min_block) if avail else []
            user_free_blocks.append(free)
        # Intersect free blocks
        mutual_blocks = intersect_free_blocks(user_free_blocks, min_block)
        for block in mutual_blocks:
            tag = tag_block(block, users, user_busy_blocks)
            score = score_block(block)
            results.append(FreeBlock(
                date=day,
                start=block["start"].strftime("%H:%M"),
                end=block["end"].strftime("%H:%M"),
                participants_available=[users[i].user_id for i in block["participants"]],
                tag=tag,
                score=score
            ))
    # Sort by date and start time
    results.sort(key=lambda b: (b.date, b.start))
    return results

# --- FastAPI Route ---
@app.get("/mutual-freetime", response_model=List[FreeBlock])
def mutual_freetime_route(users: Optional[str] = Query(None)):
    # For demo, use mock data if no users param
    if not users:
        users = "user1,user2,user3"
    user_list = users.split(",")
    # Mock calendars
    mock_data = {
        "user1": UserCalendar(
            user_id="user1",
            events=[
                Event(start="2025-06-20T09:00:00", end="2025-06-20T10:00:00"),
                Event(start="2025-06-20T13:00:00", end="2025-06-20T14:00:00", status="tentative"),
                Event(start="2025-06-21T15:00:00", end="2025-06-21T16:00:00"),
            ],
            availability_start="08:00",
            availability_end="22:00",
            timezone="UTC"
        ),
        "user2": UserCalendar(
            user_id="user2",
            events=[
                Event(start="2025-06-20T11:00:00", end="2025-06-20T12:00:00"),
                Event(start="2025-06-20T15:00:00", end="2025-06-20T16:00:00"),
                Event(start="2025-06-21T18:00:00", end="2025-06-21T19:00:00"),
            ],
            availability_start="09:00",
            availability_end="21:00",
            timezone="UTC"
        ),
        "user3": UserCalendar(
            user_id="user3",
            events=[
                Event(start="2025-06-20T08:30:00", end="2025-06-20T09:30:00"),
                Event(start="2025-06-20T17:00:00", end="2025-06-20T18:00:00"),
                Event(start="2025-06-21T12:00:00", end="2025-06-21T13:00:00"),
            ],
            availability_start="08:00",
            availability_end="20:00",
            timezone="UTC"
        ),
    }
    selected_users = [mock_data[u] for u in user_list if u in mock_data]
    return calculate_mutual_free_time(selected_users)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 