/*
 *	Taken from 'Basic Workshop' by Mike Geig.
 *	Written by James Leahy. (c) 2018 DeFunc Art.
 *	https://github.com/defuncart/
 */
namespace game 
{
    //a filter which returns Enemy entities
    export class EnemyBehaviorFilter extends ut.EntityFilter 
	{
        entity: ut.Entity;
        position: ut.Core2D.TransformLocalPosition;
		tag: game.EnemyTag;
		speed: game.MoveSpeed;
		speedChange: game.ChangeOverTime;
		bounds: game.Boundaries;
    }

    //a behaviour which
    export class EnemyBehavior extends ut.ComponentBehaviour 
	{
		//data results of the filter
        data: EnemyBehaviorFilter;

		//callback whenever an enemy entity is enabled
        OnEntityEnable():void 
		{
			//determine the new speed value
            let totalTime = ut.Time.time();
			let newSpeed = this.data.speed.speed + (this.data.speedChange.changePerSecond * totalTime);
			
			//update the entity's speed
			this.data.speed.speed = newSpeed;
			
			//generate a random position
			let randomX = getRandom(this.data.bounds.minX, this.data.bounds.maxX);
			let newPos = new Vector3(randomX, this.data.bounds.maxY, 0);
			
			//update the entity's position
			this.data.position.position = newPos;

			console.log("enemy initialized. Speed: " + newSpeed);
        }
		
		//callback whenever an enemy entity is updated
        OnEntityUpdate():void 
		{
			//get the entity's current position and move it downwards
            let localPosition = this.data.position.position;
			localPosition.y -= this.data.speed.speed * ut.Time.deltaTime();

			//update the entity's position
			this.data.position.position = localPosition;

			//if the entity is off the screen, destroy it
			if(localPosition.y <= this.data.bounds.minY)
			{
				//this.world.addComponent(this.entity, ut.Disabled);
				this.world.destroyEntity(this.data.entity);
			}	
        }
    }

	//helper function which returns a random value between [min, max]
	function getRandom(min, max) 
	{
		return Math.random() * (max - min + 1) + min;
	}
}
