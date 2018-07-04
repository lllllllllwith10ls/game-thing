const entityUpdate = () {
	for(let i = 0; i < bullets.length; i++) {
		if(bullets[i].dead !== true) {
			if(bullets[i].xPos < 0 || bullets[i].yPos < 0 || bullets[i].xPos > 400 || bullets[i].yPos > 400) {
				bullets[i].dead = true;
			} else{
				bullets[i].xPos += bullets[i].vX;
				bullets[i].yPos += bullets[i].vY;
			}
		}
	}
	for(var i = 0; i <= bullets.length-1; i++) {
		if(bullets[i].dead === true) {
			bullets.splice(i,1);
		}
	}
    }
}



class Bullet {
	constructor(x,y,vx,vy) {
		this.xPos = x;
		this.yPos = y;
		this.vX = vx;
		this.vY = vy;
		this.dead = false;
		this.health = 5;
	}
}
