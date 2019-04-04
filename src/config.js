export const API_ROOT = (process.env.NODE_ENV === 'production')
			? 'https://api.jackhu.top/'
            : 'http://121.42.178.20:8011'

export const PERMISSION_MATCH = [
    "Super Administrator",
    "Group Administrator",
    "Unit Administrator",
    "Guider",
    "User",
    "Group Admin Assister",
    "Unit Admin Assister",
    "Guider Assister",
    "Student",
]
