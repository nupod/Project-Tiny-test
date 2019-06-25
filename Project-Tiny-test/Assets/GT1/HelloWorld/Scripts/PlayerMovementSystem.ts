/*
 *	Taken from 'Basic Workshop' by Mike Geig.
 *	Written by James Leahy. (c) 2018 DeFunc Art.
 *	https://github.com/defuncart/
 */
namespace game 
{
    //a system which processes player movement
    @ut.executeAfter(ut.Shared.InputFence)
    export class PlayerMovementSystem extends ut.ComponentSystem 
	{
		//callback each frame
        OnUpdate():void 
		{
			//get the current delta time
			let dt = ut.Time.deltaTime();

			//query to get the player (i.e. entities which have a MoveSpeed, PlayerTag, Boundaries and Transform component)
			this.world.forEach([game.MoveSpeed, game.PlayerTag, game.Boundaries, ut.Core2D.TransformLocalPosition], (speed, tag, bounds, position) => 
			{
				//get a reference to the current position
				let newPosition = position.position;

				//if WSAD are pressed, update position accordingly
				if(ut.Runtime.Input.getKey(ut.Core2D.KeyCode.W))
				{
					newPosition.y += speed.speed * dt;
				}
				else if(ut.Runtime.Input.getKey(ut.Core2D.KeyCode.S))
				{
					newPosition.y -= speed.speed * dt;
				}
				else if(ut.Runtime.Input.getKey(ut.Core2D.KeyCode.A))
				{
					newPosition.x -= speed.speed * dt;
				}
				else if(ut.Runtime.Input.getKey(ut.Core2D.KeyCode.D))
				{
					newPosition.x += speed.speed * dt;
				}

				//clamp the position between [minX, minY] and [maxX, maxY]
				newPosition.x = Math.max(bounds.minX, Math.min(bounds.maxX, newPosition.x));
				newPosition.y = Math.max(bounds.minY, Math.min(bounds.maxY, newPosition.y));

				//finally update the entity's position
				position.position = newPosition;
			});
		}
    }
}
