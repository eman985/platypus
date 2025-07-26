"""
Application constants and enums
"""

from enum import Enum


class PetState(Enum):
    """Pet behavior states"""
    IDLE = "idle"
    WALKING = "walking"
    JUMPING = "jumping"
    SLEEPING = "sleeping"
    CELEBRATING = "celebrating"


class PetMood(Enum):
    """Pet mood states based on productivity patterns"""
    ECSTATIC = "ecstatic"      # Highly productive, completing many tasks
    HAPPY = "happy"            # Good productivity, regular activity
    CONTENT = "content"        # Moderate productivity, some activity  
    NEUTRAL = "neutral"        # Average productivity
    RESTLESS = "restless"      # Low activity, needs motivation
    TIRED = "tired"            # Overworked, needs break
    BORED = "bored"            # No activity for extended period
    SLEEPY = "sleepy"          # Inactive for very long time


class TimerState(Enum):
    """Pomodoro timer states"""
    STOPPED = "stopped"
    WORKING = "working"
    SHORT_BREAK = "short_break"
    LONG_BREAK = "long_break"
    PAUSED = "paused"


class NotificationType(Enum):
    """Types of notifications"""
    REMINDER = "reminder"
    ACHIEVEMENT = "achievement"
    TIMER_COMPLETE = "timer_complete"
    XP_GAINED = "xp_gained"


class PetEvolution(Enum):
    """Pet evolution stages based on level"""
    EGG = "egg"                # Level 0-2
    HATCHLING = "hatchling"    # Level 3-9
    JUVENILE = "juvenile"      # Level 10-19
    ADULT = "adult"            # Level 20-49
    ELDER = "elder"            # Level 50-99
    LEGENDARY = "legendary"    # Level 100+

# Evolution thresholds
EVOLUTION_LEVELS = {
    PetEvolution.EGG: 0,
    PetEvolution.HATCHLING: 3,
    PetEvolution.JUVENILE: 10,
    PetEvolution.ADULT: 20,
    PetEvolution.ELDER: 50,
    PetEvolution.LEGENDARY: 100
}

# Shop item categories
SHOP_CATEGORIES = {
    "accessories": "Accessories",
    "backgrounds": "Backgrounds", 
    "emotes": "Emotes",
    "food": "Food & Treats"
}

# Default shop items
DEFAULT_SHOP_ITEMS = [
    {
        "id": "hat_detective",
        "name": "Detective Hat",
        "category": "accessories",
        "price": 50,
        "description": "A stylish detective hat for your platypus"
    },
    {
        "id": "background_forest",
        "name": "Forest Background",
        "category": "backgrounds", 
        "price": 30,
        "description": "A peaceful forest scene"
    },
    {
        "id": "emote_hearts",
        "name": "Heart Eyes",
        "category": "emotes",
        "price": 20,
        "description": "Show some love!"
    },
    {
        "id": "food_fish",
        "name": "Fresh Fish",
        "category": "food",
        "price": 15,
        "description": "A tasty treat that makes your platypus happy"
    }
]

# Achievement definitions
ACHIEVEMENTS = [
    {
        "id": "first_pomodoro",
        "name": "Getting Started",
        "description": "Complete your first Pomodoro session",
        "xp_reward": 25,
        "condition": "pomodoros_completed >= 1"
    },
    {
        "id": "productive_day",
        "name": "Productive Day",
        "description": "Complete 8 Pomodoro sessions in one day",
        "xp_reward": 100,
        "condition": "daily_pomodoros >= 8"
    },
    {
        "id": "task_master",
        "name": "Task Master",
        "description": "Complete 50 todo items",
        "xp_reward": 150,
        "condition": "todos_completed >= 50"
    },
    {
        "id": "dedicated_learner",
        "name": "Dedicated Learner",
        "description": "Study for 10 hours total",
        "xp_reward": 200,
        "condition": "total_study_minutes >= 600"
    }
]

# Default user data structure
DEFAULT_USER_DATA = {
    "setup_complete": False,
    "name": "",
    "goals": [],
    "pet_name": "Platty",
    "pet_accessories": [],
    "xp": 0,
    "level": 1,
    "total_study_minutes": 0,
    "pomodoros_completed": 0,
    "todos_completed": 0,
    "achievements_unlocked": [],
    "purchased_items": [],
    "settings": {
        "work_duration": 25,
        "short_break_duration": 5,
        "long_break_duration": 15,
        "sound_enabled": True,
        "notifications_enabled": True,
        "auto_start_breaks": False
    },
    "todos": [],
    "timer_history": [],
    "last_break_reminder": 0,
    "last_water_reminder": 0
}
