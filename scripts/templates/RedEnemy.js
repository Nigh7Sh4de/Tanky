var RedEnemy = function() {
    this.move = function(dt, MULT) {
        this.entity.rigidbody.applyImpulse(this.dir.clone().scale(dt * MULT * ((score.script.score.points / 100) + 1)));
    };

    Enemy.apply(this, arguments);
}

//RedEnemy = pc.inherits(RedEnemy, Enemy);
