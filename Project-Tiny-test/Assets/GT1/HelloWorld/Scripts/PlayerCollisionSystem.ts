/*
 *	Taken from 'Basic Workshop' by Mike Geig.
 *	Written by James Leahy. (c) 2018 DeFunc Art.
 *	https://github.com/defuncart/
 */
namespace game 
{
    //a system which detects collision between the player and enemies
    export class PlayerCollisionSystem extends ut.ComponentSystem 
	{  
		//callback each frame
        OnUpdate():void 
		{
			//start by assuming that the game isn't over
			let isGameOver = false;

			//query to determine if the player has collided with something
			this.world.forEach([ut.Entity, ut.Core2D.TransformLocalPosition, ut.HitBox2D.HitBoxOverlapResults, game.PlayerTag], (entity, position, contacts, tag) => 
			{
				//there is some strange issue where two overlaps are always registered - the player must be colliding with iself
				//this if statement ignores such a case
				if(contacts.overlaps.length == 2 && contacts.overlaps[0].otherEntity.index == contacts.overlaps[1].otherEntity.index)
				{
					return;
				}

				//instantiate an explosion
				let explosion = ut.EntityGroup.instantiate(this.world, "game.ExplosionGroup")[0];

				//set the explosion's position to be the player's current position
				this.world.usingComponentData(explosion, [ut.Core2D.TransformLocalPosition], (explosionPos) => 
				{
					explosionPos.position = position.position;
				});
				
				//destroy the player and set isGameOver flag
				this.world.destroyEntity(entity);
				isGameOver = true;
			});

			//if the game is over, restart the game
			if(isGameOver)
			{
				// console.log("Game Over");
				game.GameService.restart(this.world);
			}
        }
    }
}
