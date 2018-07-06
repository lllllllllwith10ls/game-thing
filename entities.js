const entityUpdate = () => {
	for(let i = 0; i < bullets.length; i++) {
		if(bullets[i].dead !== true) {
			if(bullets[i].xPos < 0 || bullets[i].yPos < 0 || bullets[i].xPos > 400 || bullets[i].yPos > 400) {
				bullets[i].dead = true;
			} else{
				bullets[i].xPos += bullets[i].vX;
				bullets[i].yPos += bullets[i].vY;
				for(let j = 0; j < enemies.length; j++) {
					if(enemies[j].dead !== true) {
						bulletCollision(i,j);
					}
				}
			}
		}
	}
	for(var i = 0; i <= bullets.length-1; i++) {
		if(bullets[i].dead === true) {
			bullets.splice(i,1);
		}
	}
	for(let i = 0; i < enemies.length; i++) {
		if(enemies[i].dead !== true) {
			if(enemies[i].vY < -enemies[i].speed) {
				enemies[i].vY = -enemies[i].speed;
			}
			if(enemies[i].vX < -enemies[i].speed) {
				enemies[i].vX = -enemies[i].speed;
			}
			if(enemies[i].vY > enemies[i].speed) {
				enemies[i].vY = enemies[i].speed;
			}
			if(enemies[i].vX > enemies[i].speed) {
				enemies[i].vX = enemies[i].speed;
			}
			if(enemies[i].behavior === "projectile") {
				if(enemies[i].xPos < 0 || enemies[i].yPos < 0 || enemies[i].xPos > 400 || enemies[i].yPos > 400) {
					enemies[i].dead = true;
				}
			} else {
				if (enemies[i].xPos < 0) {
					enemies[i].xPos = 0;
					enemies[i].vX = -enemies[i].vX * 1/2;
				}
				if (enemies[i].xPos > 400) {
					enemies[i].xPos = 400;
					enemies[i].vX = -enemies[i].vX * 1/2;
				}
				if (enemies[i].yPos < 0) {
					enemies[i].yPos = 0;
					enemies[i].vY = -enemies[i].vY * 1/2;
				}
				if (enemies[i].yPos > 400) {
					enemies[i].yPos = 400;
					enemies[i].vY = -enemies[i].vY * 1/2;
				}
			}
			if(enemies[i].behavior === "chaser") {
				let angle = Math.atan2(player.xPos-enemies[i].xPos,player.yPos-enemies[i].yPos);
				enemies[i].vX += Math.sin(angle) * enemies[i].accel;
				enemies[i].vY += Math.cos(angle) * enemies[i].accel;
			}
			if(enemies[i].behavior === "strafer") {
				let angle = Math.atan2(player.xPos-enemies[i].xPos,player.yPos-enemies[i].yPos);
				if(Math.sqrt(Math.pow(enemies[i].xPos-player.xPos,2)+Math.pow(enemies[i].yPos-player.yPos,2)) < 100) {
					enemies[i].vX -= Math.sin(angle) * enemies[i].accel;
					enemies[i].vY -= Math.cos(angle) * enemies[i].accel;
				} else {
					enemies[i].vX += Math.sin(angle) * enemies[i].accel;
					enemies[i].vY += Math.cos(angle) * enemies[i].accel;
				}
			}
			
			enemies[i].xPos += enemies[i].vX;
			enemies[i].yPos += enemies[i].vY;
			for(let j = 0; j < enemies.length; j++) {
				if(enemies[j].dead !== true && j !== i) {
					enemyCollision(i,j);
				}
			}
		}
	}
	for(var i = 0; i <= bullets.length-1; i++) {
		if(bullets[i].dead === true) {
			bullets.splice(i,1);
		}
	}
	for(var i = 0; i <= enemies.length-1; i++) {
		if(enemies[i].dead === true) {
			if(enemies[i].name === "splitter") {
				let crashers = Math.random() * 3 + 1;
				for(crashers; crashers > 0; crashers--) {
					enemies.push(new Crasher(enemies[i].xPos+(Math.random()-0.5)*10,enemies[i].yPos+(Math.random()-0.5)*10,0,0));
				}
			}
			enemies.splice(i,1);
		}
	}
	
};

const bulletCollision = (b,e) => {
	if(
		bullets[b].xPos - bullets[b].hitbox < enemies[e].xPos + enemies[e].hitbox &&
		bullets[b].xPos + bullets[b].hitbox > enemies[e].xPos - enemies[e].hitbox &&
		bullets[b].yPos - bullets[b].hitbox < enemies[e].yPos + enemies[e].hitbox &&
		bullets[b].yPos + bullets[b].hitbox > enemies[e].yPos - enemies[e].hitbox &&
		enemies[e].behavior !== "projectile"
	) {
		if(bullets[b].health > enemies[e].health) {
			bullets[b].health -= enemies[e].health;
			enemies[e].dead = true;
		} else {
			enemies[e].health -= bullets[b].health;
			bullets[b].dead = true;
			if(enemies[e].health <= 0) {
				enemies[e].dead = true;
			}
		}
	}
}
const enemyCollision = (e1,e2) => {
	if (
		enemies[e1].xPos - enemies[e1].hitbox < enemies[e2].xPos + enemies[e2].hitbox &&
		enemies[e1].xPos + enemies[e1].hitbox > enemies[e2].xPos - enemies[e2].hitbox &&
		enemies[e1].yPos - enemies[e1].hitbox < enemies[e2].yPos + enemies[e2].hitbox &&
		enemies[e1].yPos + enemies[e1].hitbox > enemies[e2].yPos - enemies[e2].hitbox &&
		enemies[e1].ghost !== true && enemies[e2].ghost !== true
	) {
		let angle = Math.atan2(enemies[e1].xPos-enemies[e2].xPos,enemies[e1].yPos-enemies[e2].yPos);
		enemies[e1].vX += Math.sin(angle) * enemies[e1].accel;
		enemies[e1].vY += Math.cos(angle) * enemies[e1].accel;
		enemies[e2].vX += -Math.sin(angle) * enemies[e2].accel;
		enemies[e2].vY += -Math.cos(angle) * enemies[e2].accel;
	}
}

class Bullet {
	constructor(x,y,vx,vy) {
		this.xPos = x;
		this.yPos = y;
		this.vX = vx;
		this.vY = vy;
		this.dead = false;
		this.health = player.damage;
		this.hitbox = 2.5;
	}
};
class Crasher {
	constructor(x,y,vx,vy) {
		this.name = "crasher";
		this.behavior = "chaser";
		this.xPos = x;
		this.yPos = y;
		this.vX = vx;
		this.vY = vy;
		this.dead = false;
		this.accel = 0.1;
		this.speed = 2;
		this.health = 2;
		this.hitbox = 10;
		this.angle = 0;
	}
};
class BigCrasher {
	constructor(x,y,vx,vy) {
		this.name = "big crasher";
		this.behavior = "chaser";
		this.xPos = x;
		this.yPos = y;
		this.vX = vx;
		this.vY = vy;
		this.dead = false;
		this.accel = 0.05;
		this.speed = 1;
		this.health = 15;
		this.hitbox = 15;
		this.angle = 0;
	}
};
class Splitter {
	constructor(x,y,vx,vy) {
		this.name = "splitter";
		this.behavior = "chaser";
		this.xPos = x;
		this.yPos = y;
		this.vX = vx;
		this.vY = vy;
		this.dead = false;
		this.accel = 0.05;
		this.speed = 1;
		this.health = 7.5;
		this.hitbox = 10;
		this.angle = Math.random() * 2 * Math.PI;
	}
};
class SpawnerBoss {
	constructor(x,y,vx,vy) {
		this.name = "spawner boss";
		this.behavior = "chaser";
		this.xPos = x;
		this.yPos = y;
		this.vX = vx;
		this.vY = vy;
		this.dead = false;
		this.accel = 0.001;
		this.speed = 0.1;
		this.health = 300;
		this.hitbox = 30;
		this.angle = 0;
		this.cooldown = 0;
		this.stopwaves = true;
		this.ghost = true;
	}
};
class MiniSpawner {
	constructor(x,y,vx,vy) {
		this.name = "mini spawner";
		this.behavior = "chaser";
		this.xPos = x;
		this.yPos = y;
		this.vX = vx;
		this.vY = vy;
		this.dead = false;
		this.accel = 0.05;
		this.speed = 1;
		this.health = 7.5;
		this.hitbox = 10;
		this.angle = 0;
		this.cooldown = 0;
		this.ghost = true;
	}
};
class EnemyBullet {
	constructor(x,y,vx,vy) {
		this.name = "enemy bullet";
		this.behavior = "projectile";
		this.xPos = x;
		this.yPos = y;
		this.vX = vx;
		this.vY = vy;
		this.dead = false;
		this.speed = 3;
		this.health = 5;
		this.hitbox = 3;
		this.ghost = true;
	}
};
class Shooter {
	constructor(x,y,vx,vy) {
		this.name = "shooter";
		this.behavior = "strafer";
		this.xPos = x;
		this.yPos = y;
		this.vX = vx;
		this.vY = vy;
		this.dead = false;
		this.accel = 0.05;
		this.speed = 0.5;
		this.health = 10;
		this.hitbox = 10;
		this.angle = 0;
		this.angle2 = Math.random() * 2 * Math.PI;
		this.cooldown = 0;
	}
};
class TripleShot {
	constructor(x,y,vx,vy) {
		this.name = "triple shot";
		this.behavior = "strafer";
		this.xPos = x;
		this.yPos = y;
		this.vX = vx;
		this.vY = vy;
		this.dead = false;
		this.accel = 0.05;
		this.speed = 0.5;
		this.health = 20;
		this.hitbox = 10;
		this.angle = 0;
		this.angle2 = Math.random() * 2 * Math.PI;
		this.cooldown = 0;
	}
};
class ShooterBoss {
	constructor(x,y,vx,vy) {
		this.name = "shooter boss";
		this.behavior = "strafer";
		this.xPos = x;
		this.yPos = y;
		this.vX = vx;
		this.vY = vy;
		this.dead = false;
		this.accel = 0.001;
		this.speed = 0.1;
		this.health = 500;
		this.hitbox = 50;
		this.angle = 0;
		this.angle2 = Math.random() * 2 * Math.PI;
		this.cooldown = 0;
		this.attack = "none";
		this.reload = 10;
		this.reloadCooldown = 0;
	}
};




