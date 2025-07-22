import { supabase } from "./supabase";

export function getUserAvatar(user_profile) {
    return user_profile?.avatar_url || `https://ui-avatars.com/api/?name=${user_profile.username}&background=8e44ad&color=fff`
}

export function didUserWinGame(game, user) {
    return game.games.winner === user.id
}

export function generateUser() {
    const adjectives = ["Swift", "Brave", "Clever", "Mysterious", "Silent", "Loyal", "Witty", "Fierce"];
    const nouns = ["Tiger", "Panda", "Storm", "Lantern", "Wolf", "Falcon", "Shadow", "Phoenix"];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(100 + Math.random() * 900); // 3-digit number

    const userId = Math.random().toString(36).substring(2, 15); // Random alphanumeric string
    const profileId = Math.random().toString(36).substring(2, 15); // Random alphanumeric string
    return {
        id: userId,
        user_profile: {
            id: profileId,
            username: `${randomAdjective}${randomNoun}${randomNumber}`,
            avatar_url: null,
        }
    };
}

export async function isUserAuthenticated() {
    const { data, error } = await supabase.auth.getSession()
    return data.session ? true : false
}