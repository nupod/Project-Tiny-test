/*
 *	Taken from 'Basic Workshop' by Mike Geig.
 *	Written by James Leahy. (c) 2018 DeFunc Art.
 *	https://github.com/defuncart/
 */
namespace game 
{
    //a service to control the game
    export class GameService 
    {
        //entity group names
        private static mainGroup: string = 'game.MainGroup';
        private static enemyGroup: string = 'game.EnemyGroup';
        private static explosionGroup: string = 'game.ExplosionGroup';
        
        //the timeout in ms
        private static timeout: number = 3000; 

        //a method which restarts a given world
        static restart(world: ut.World) 
        {
            setTimeout(() => 
            { 
                this.newGame(world);
            }, this.timeout);
        };

        //a method which starts a new game
        static newGame(world: ut.World) 
        {
            console.log("New Game");

            //reset time elapsed
            ut.Time.reset();

            //destroy all entity groups
            ut.EntityGroup.destroyAll(world, this.mainGroup);
            ut.EntityGroup.destroyAll(world, this.enemyGroup);
            ut.EntityGroup.destroyAll(world, this.explosionGroup);

            //instantiate main entity group
            ut.EntityGroup.instantiate(world, this.mainGroup);
        };
    }
}