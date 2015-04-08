function RedEnemy() {
    var move = function (dt, MULT) {
        this.entity.rigidbody.applyImpulse(this.dir.clone().scale(dt * MULT * ((score.script.score.points / 100) + 1)));
    };
    Enemy.call(this, move);
}
pc.inherits(RedEnemy, Enemy);
