const WebSocket = require('ws');
const express = require('express'),
    router = express.Router()

        /**
     * @param {WebSocket.Server} websocket
     */
    function routes(websocket, messageStatus){
        router.all('*', function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Auth, Content-Type, Accept");
            next();
        });
    
        router.options('*', function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Auth, Content-Type, Accept");
            next();
        });
        
        router.get('/alive', function (req, res, next) {
            res.send({ message: "OK"});
        });
    
        router.get('/reward', function (req, res) {
            console.log("REWARD")
            if(messageStatus.isListening){
                websocket.clients.forEach(socket => {
                    socket.send(JSON.stringify({
                        "type": "MESSAGE",
                        "data": {
                            "topic": "channel-points-channel-v1.161053253",
                            "message": "{\"type\":\"reward-redeemed\",\"data\":{\"timestamp\":\"2020-12-12T02:28:54.131750346Z\",\"redemption\":{\"id\":\"89b9135a-b666-4071-b2de-80a9b39bb702\",\"user\":{\"id\":\"161053253\",\"login\":\"camjocotem\",\"display_name\":\"camjocotem\"},\"channel_id\":\"161053253\",\"redeemed_at\":\"2020-12-12T02:28:54.131750346Z\",\"reward\":{\"id\":\"342df879-58d9-4bd8-aa98-4c68ae538acb\",\"channel_id\":\"161053253\",\"title\":\"Add Goose for whole stream\",\"prompt\":\"\",\"cost\":5000,\"is_user_input_required\":false,\"is_sub_only\":false,\"image\":null,\"default_image\":{\"url_1x\":\"https://static-cdn.jtvnw.net/custom-reward-images/default-1.png\",\"url_2x\":\"https://static-cdn.jtvnw.net/custom-reward-images/default-2.png\",\"url_4x\":\"https://static-cdn.jtvnw.net/custom-reward-images/default-4.png\"},\"background_color\":\"#9147FF\",\"is_enabled\":true,\"is_paused\":false,\"is_in_stock\":true,\"max_per_stream\":{\"is_enabled\":false,\"max_per_stream\":2},\"should_redemptions_skip_request_queue\":false,\"template_id\":null,\"updated_for_indicator_at\":\"2020-10-14T17:20:40.215622543Z\",\"max_per_user_per_stream\":{\"is_enabled\":false,\"max_per_user_per_stream\":0},\"global_cooldown\":{\"is_enabled\":false,\"global_cooldown_seconds\":0},\"redemptions_redeemed_current_stream\":null,\"cooldown_expires_at\":null},\"status\":\"UNFULFILLED\"}}}"
                        }
                    }));
                });
                res.send({ message: "OK"});
            }
            else{
                res.status(400).send();
            }
        });
        return router;
    }

module.exports = routes;