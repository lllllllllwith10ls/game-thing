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
			if(enemies[i].vX < enemies[i].speed) {
				enemies[i].vX = enemies[i].speed;
			}
			if (enemies[i].xPos < 0) {
				enemies[i].xPos = 0;
				enemies[i].vX = -enemies[i].vX * 4/5;
			}
			if (enemies[i].xPos > 400) {
				enemies[i].xPos = 400;
				enemies[i].vX = -enemies[i].vX * 4/5;
			}
			if (enemies[i].yPos < 0) {
				enemies[i].yPos = 0;
				enemies[i].vY = -enemies[i].vY * 4/5;
			}
			if (enemies[i].yPos > 400) {
				enemies[i].yPos = 400;
				enemies[i].vY = -enemies[i].vY * 4/5;
			}
			if(enemies[i].behavior === "chaser") {
				let angle = Math.atan2(player.xPos-enemies[i].xPos,player.yPos-enemies[i].yPos);
				enemies[i].vX += Math.sin(angle) * enemies[i].accel;
				enemies[i].vY += Math.cos(angle) * enemies[i].accel;
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
			enemies.splice(i,1);
		}
	}
	
};

const bulletCollision = (b,e) => {
	if((bullets[b].xPos-bullets[b].hitbox < enemies[e].xPos+enemies[e].hitbox) || (bullets[b].xPos+bullets[b].hitbox > enemies[e].xPos-enemies[e].hitbox) || (bullets[b].yPos-bullets[b].hitbox < enemies[e].yPos+enemies[e].hitbox) || (bullets[b].yPos+bullets[b].hitbox > enemies[e].yPos-enemies[e].hitbox)) {
		
	} else {
		if(bullets[b].health > enemies[b].health) {
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
	if((enemies[e1].xPos-enemies[e1].hitbox < enemies[e2].xPos+enemies[e2].hitbox) || (enemies[e1].xPos+enemies[e1].hitbox > enemies[e2].xPos-enemies[e2].hitbox) || (enemies[e1].yPos-enemies[e1].hitbox < enemies[e2].yPos+enemies[e2].hitbox) || (enemies[e1].yPos+enemies[e1].hitbox > enemies[e2].yPos-enemies[e2].hitbox)) {
		
	} else {
		let angle = Math.atan2(enemies[e1].xPos-enemies[e2].xPos,enemies[e1].yPos-enemies[e2].yPos);
		enemies[e1].vX += -Math.sin(angle);
		enemies[e1].vY += -Math.cos(angle);
		enemies[e2].vX += Math.sin(angle);
		enemies[e2].vY += Math.cos(angle);
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
		this.speed = 3;
		this.health = 2.5;
		this.hitbox = 5;
		this.angle = 0;
	}
};

