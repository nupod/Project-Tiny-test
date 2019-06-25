/*
 *	Taken from 'Basic Workshop' by Mike Geig.
 *	Written by James Leahy. (c) 2018 DeFunc Art.
 *	https://github.com/defuncart/
 */
namespace game 
{
    //a system which scrolls the background each frame
    export class ScrollingBackgroundSystem extends ut.ComponentSystem 
	{
		//callback each frame
        OnUpdate():void 
		{
			//get the current delta time
			let dt = ut.Time.deltaTime();

			//query to get each entity which has the ScrollingBackground component
			this.world.forEach([ut.Core2D.TransformLocalPosition, game.ScrollingBackground], (position, scrolling) => 
			{
				//get the transform's current position and move it downwards
				let newPosition = position.position;
				newPosition.y -= scrolling.speed * dt;
				
				//if the vertical position is below the treshold, then reset
				if(newPosition.y < scrolling.threshold)
				{
					newPosition.y += scrolling.distance;
				}
					
				//finally update the entity's position
				position.position = newPosition;
			});
        }
    }
}
