class LocalApiService {
    /**
     * @param {String} clientId
     */
    constructor() {
        this.port = location.port;
    }

    async isAlive() {
        return await this._fetch(`/alive`);
    }

    async redeemReward(){
        return await this._fetch(`/reward`);
    }
    async _fetch(url){
        return await (await fetch((`http://localhost:${this.port}/api` + url))).json()
    }
}