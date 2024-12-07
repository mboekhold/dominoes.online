export function getUserAvatar(user_profile) {
    console.log(user_profile?.avatar_url || `https://ui-avatars.com/api/?name=${user_profile.username}&background=8e44ad&color=fff`)
    return user_profile?.avatar_url || `https://ui-avatars.com/api/?name=${user_profile.username}&background=8e44ad&color=fff`
}