export async function awardJestCoins(amount: number, reason: string) {
  try {
    const response = await fetch("/api/jestcoins", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        reason,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to award JestCoins")
    }

    return await response.json()
  } catch (error) {
    console.error("Error awarding JestCoins:", error)
    return null
  }
}

// JestCoin rewards for different actions
export const JESTCOIN_REWARDS = {
  DAILY_LOGIN: 5,
  POST_COMMENT: 2,
  FAVORITE_ITEM: 1,
  ATTEND_EVENT: 10,
  PURCHASE_ITEM: 20,
  PROFILE_COMPLETE: 15,
}

