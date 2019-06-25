/*
 *	Taken from 'Basic Workshop' by Mike Geig.
 *	Written by James Leahy. (c) 2018 DeFunc Art.
 *	https://github.com/defuncart/
 */
namespace game 
{
     //a system which processes all spawners
    export class SpawnSystem extends ut.ComponentSystem 
	{
		//callback each frame
        OnUpdate():void 
		{
			//query to get all Spawner entities and loop through them
			this.world.forEach([game.Spawner], (spawner) => 
			{
				//only process spawners which are not paused
				if(!spawner.isPaused)
				{
					//reduce the spawner's countdown timer
					let time = spawner.time;
					time -= ut.Time.deltaTime();
	
					//if it is time to spawn
					if(time <= 0) 
					{
						//reset the timer
						time += spawner.delay;
						//and spawn an entity group
						ut.EntityGroup.instantiate(this.world, spawner.spawnedGroup);
					}
	
					//update the spawer's countdown time
					spawner.time = time;
				}
			});
        }
    }
}
