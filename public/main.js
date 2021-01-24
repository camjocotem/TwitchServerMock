var apiService = new LocalApiService();

async function testReward(){
    let res = await apiService.isAlive();
    alert(JSON.stringify(res));
}

async function redeemReward(){
    await apiService.redeemReward()
}