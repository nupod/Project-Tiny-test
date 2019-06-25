var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/*
 *	Taken from 'Basic Workshop' by Mike Geig.
 *	Written by James Leahy. (c) 2018 DeFunc Art.
 *	https://github.com/defuncart/
 */
var game;
(function (game) {
    //a filter which returns Enemy entities
    var EnemyBehaviorFilter = /** @class */ (function (_super) {
        __extends(EnemyBehaviorFilter, _super);
        function EnemyBehaviorFilter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return EnemyBehaviorFilter;
    }(ut.EntityFilter));
    game.EnemyBehaviorFilter = EnemyBehaviorFilter;
    //a behaviour which
    var EnemyBehavior = /** @class */ (function (_super) {
        __extends(EnemyBehavior, _super);
        function EnemyBehavior() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //callback whenever an enemy entity is enabled
        EnemyBehavior.prototype.OnEntityEnable = function () {
            //determine the new speed value
            var totalTime = ut.Time.time();
            var newSpeed = this.data.speed.speed + (this.data.speedChange.changePerSecond * totalTime);
            //update the entity's speed
            this.data.speed.speed = newSpeed;
            //generate a random position
            var randomX = getRandom(this.data.bounds.minX, this.data.bounds.maxX);
            var newPos = new Vector3(randomX, this.data.bounds.maxY, 0);
            //update the entity's position
            this.data.position.position = newPos;
            console.log("enemy initialized. Speed: " + newSpeed);
        };
        //callback whenever an enemy entity is updated
        EnemyBehavior.prototype.OnEntityUpdate = function () {
            //get the entity's current position and move it downwards
            var localPosition = this.data.position.position;
            localPosition.y -= this.data.speed.speed * ut.Time.deltaTime();
            //update the entity's position
            this.data.position.position = localPosition;
            //if the entity is off the screen, destroy it
            if (localPosition.y <= this.data.bounds.minY) {
                //this.world.addComponent(this.entity, ut.Disabled);
                this.world.destroyEntity(this.data.entity);
            }
        };
        return EnemyBehavior;
    }(ut.ComponentBehaviour));
    game.EnemyBehavior = EnemyBehavior;
    //helper function which returns a random value between [min, max]
    function getRandom(min, max) {
        return Math.random() * (max - min + 1) + min;
    }
})(game || (game = {}));
/*
 *	Taken from 'Basic Workshop' by Mike Geig.
 *	Written by James Leahy. (c) 2018 DeFunc Art.
 *	https://github.com/defuncart/
 */
var game;
(function (game) {
    //a service to control the game
    var GameService = /** @class */ (function () {
        function GameService() {
        }
        //a method which restarts a given world
        GameService.restart = function (world) {
            var _this = this;
            setTimeout(function () {
                _this.newGame(world);
            }, this.timeout);
        };
        ;
        //a method which starts a new game
        GameService.newGame = function (world) {
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
        ;
        //entity group names
        GameService.mainGroup = 'game.MainGroup';
        GameService.enemyGroup = 'game.EnemyGroup';
        GameService.explosionGroup = 'game.ExplosionGroup';
        //the timeout in ms
        GameService.timeout = 3000;
        return GameService;
    }());
    game.GameService = GameService;
})(game || (game = {}));
/*
 *	Taken from 'Basic Workshop' by Mike Geig.
 *	Written by James Leahy. (c) 2018 DeFunc Art.
 *	https://github.com/defuncart/
 */
var game;
(function (game) {
    //a system which detects collision between the player and enemies
    var PlayerCollisionSystem = /** @class */ (function (_super) {
        __extends(PlayerCollisionSystem, _super);
        function PlayerCollisionSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //callback each frame
        PlayerCollisionSystem.prototype.OnUpdate = function () {
            var _this = this;
            //start by assuming that the game isn't over
            var isGameOver = false;
            //query to determine if the player has collided with something
            this.world.forEach([ut.Entity, ut.Core2D.TransformLocalPosition, ut.HitBox2D.HitBoxOverlapResults, game.PlayerTag], function (entity, position, contacts, tag) {
                //there is some strange issue where two overlaps are always registered - the player must be colliding with iself
                //this if statement ignores such a case
                if (contacts.overlaps.length == 2 && contacts.overlaps[0].otherEntity.index == contacts.overlaps[1].otherEntity.index) {
                    return;
                }
                //instantiate an explosion
                var explosion = ut.EntityGroup.instantiate(_this.world, "game.ExplosionGroup")[0];
                //set the explosion's position to be the player's current position
                _this.world.usingComponentData(explosion, [ut.Core2D.TransformLocalPosition], function (explosionPos) {
                    explosionPos.position = position.position;
                });
                //destroy the player and set isGameOver flag
                _this.world.destroyEntity(entity);
                isGameOver = true;
            });
            //if the game is over, restart the game
            if (isGameOver) {
                // console.log("Game Over");
                game.GameService.restart(this.world);
            }
        };
        return PlayerCollisionSystem;
    }(ut.ComponentSystem));
    game.PlayerCollisionSystem = PlayerCollisionSystem;
})(game || (game = {}));
/*
 *	Taken from 'Basic Workshop' by Mike Geig.
 *	Written by James Leahy. (c) 2018 DeFunc Art.
 *	https://github.com/defuncart/
 */
var game;
(function (game) {
    //a system which processes player movement
    var PlayerMovementSystem = /** @class */ (function (_super) {
        __extends(PlayerMovementSystem, _super);
        function PlayerMovementSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //callback each frame
        PlayerMovementSystem.prototype.OnUpdate = function () {
            //get the current delta time
            var dt = ut.Time.deltaTime();
            //query to get the player (i.e. entities which have a MoveSpeed, PlayerTag, Boundaries and Transform component)
            this.world.forEach([game.MoveSpeed, game.PlayerTag, game.Boundaries, ut.Core2D.TransformLocalPosition], function (speed, tag, bounds, position) {
                //get a reference to the current position
                var newPosition = position.position;
                //if WSAD are pressed, update position accordingly
                if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.W)) {
                    newPosition.y += speed.speed * dt;
                }
                else if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.S)) {
                    newPosition.y -= speed.speed * dt;
                }
                else if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.A)) {
                    newPosition.x -= speed.speed * dt;
                }
                else if (ut.Runtime.Input.getKey(ut.Core2D.KeyCode.D)) {
                    newPosition.x += speed.speed * dt;
                }
                //clamp the position between [minX, minY] and [maxX, maxY]
                newPosition.x = Math.max(bounds.minX, Math.min(bounds.maxX, newPosition.x));
                newPosition.y = Math.max(bounds.minY, Math.min(bounds.maxY, newPosition.y));
                //finally update the entity's position
                position.position = newPosition;
            });
        };
        PlayerMovementSystem = __decorate([
            ut.executeAfter(ut.Shared.InputFence)
        ], PlayerMovementSystem);
        return PlayerMovementSystem;
    }(ut.ComponentSystem));
    game.PlayerMovementSystem = PlayerMovementSystem;
})(game || (game = {}));
/*
 *	Taken from 'Basic Workshop' by Mike Geig.
 *	Written by James Leahy. (c) 2018 DeFunc Art.
 *	https://github.com/defuncart/
 */
var game;
(function (game) {
    //a system which scrolls the background each frame
    var ScrollingBackgroundSystem = /** @class */ (function (_super) {
        __extends(ScrollingBackgroundSystem, _super);
        function ScrollingBackgroundSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //callback each frame
        ScrollingBackgroundSystem.prototype.OnUpdate = function () {
            //get the current delta time
            var dt = ut.Time.deltaTime();
            //query to get each entity which has the ScrollingBackground component
            this.world.forEach([ut.Core2D.TransformLocalPosition, game.ScrollingBackground], function (position, scrolling) {
                //get the transform's current position and move it downwards
                var newPosition = position.position;
                newPosition.y -= scrolling.speed * dt;
                //if the vertical position is below the treshold, then reset
                if (newPosition.y < scrolling.threshold) {
                    newPosition.y += scrolling.distance;
                }
                //finally update the entity's position
                position.position = newPosition;
            });
        };
        return ScrollingBackgroundSystem;
    }(ut.ComponentSystem));
    game.ScrollingBackgroundSystem = ScrollingBackgroundSystem;
})(game || (game = {}));
/*
 *	Taken from 'Basic Workshop' by Mike Geig.
 *	Written by James Leahy. (c) 2018 DeFunc Art.
 *	https://github.com/defuncart/
 */
var game;
(function (game) {
    //a system which processes all spawners
    var SpawnSystem = /** @class */ (function (_super) {
        __extends(SpawnSystem, _super);
        function SpawnSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //callback each frame
        SpawnSystem.prototype.OnUpdate = function () {
            var _this = this;
            //query to get all Spawner entities and loop through them
            this.world.forEach([game.Spawner], function (spawner) {
                //only process spawners which are not paused
                if (!spawner.isPaused) {
                    //reduce the spawner's countdown timer
                    var time = spawner.time;
                    time -= ut.Time.deltaTime();
                    //if it is time to spawn
                    if (time <= 0) {
                        //reset the timer
                        time += spawner.delay;
                        //and spawn an entity group
                        ut.EntityGroup.instantiate(_this.world, spawner.spawnedGroup);
                    }
                    //update the spawer's countdown time
                    spawner.time = time;
                }
            });
        };
        return SpawnSystem;
    }(ut.ComponentSystem));
    game.SpawnSystem = SpawnSystem;
})(game || (game = {}));
var ut;
(function (ut) {
    /**
     * Placeholder system to provide a UnityEngine.Time like API
     *
     * e.g.
     *  let deltaTime = ut.Time.deltaTime();
     *  let time = ut.Time.time();
     *
     */
    var Time = /** @class */ (function (_super) {
        __extends(Time, _super);
        function Time() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Time_1 = Time;
        Time.deltaTime = function () {
            return Time_1._deltaTime;
        };
        Time.time = function () {
            return Time_1._time;
        };
        Time.reset = function () {
            Time_1._time = 0;
        };
        Time.prototype.OnUpdate = function () {
            var dt = this.scheduler.deltaTime();
            Time_1._deltaTime = dt;
            Time_1._time += dt;
        };
        var Time_1;
        Time._deltaTime = 0;
        Time._time = 0;
        Time = Time_1 = __decorate([
            ut.executeBefore(ut.Shared.UserCodeStart)
        ], Time);
        return Time;
    }(ut.ComponentSystem));
    ut.Time = Time;
})(ut || (ut = {}));
var ut;
(function (ut) {
    var EntityGroup = /** @class */ (function () {
        function EntityGroup() {
        }
        /**
         * @method
         * @desc Creates a new instance of the given entity group by name and returns all entities
         * @param {ut.World} world - The world to add to
         * @param {string} name - The fully qualified name of the entity group
         * @returns Flat list of all created entities
         */
        EntityGroup.instantiate = function (world, name) {
            var data = this.getEntityGroupData(name);
            if (data == undefined)
                throw "ut.EntityGroup.instantiate: No 'EntityGroup' was found with the name '" + name + "'";
            return data.load(world);
        };
        ;
        /**
         * @method
         * @desc Destroys all entities that were instantated with the given group name
         * @param {ut.World} world - The world to destroy from
         * @param {string} name - The fully qualified name of the entity group
         */
        EntityGroup.destroyAll = function (world, name) {
            var type = this.getEntityGroupData(name).Component;
            world.forEach([ut.Entity, type], function (entity, instance) {
                // @TODO This should REALLY not be necessary
                // We are protecting against duplicate calls to `destroyAllEntityGroups` within an iteration
                if (world.exists(entity)) {
                    world.destroyEntity(entity);
                }
            });
        };
        /**
         * @method
         * @desc Returns an entity group object by name
         * @param {string} name - Fully qualified group name
         */
        EntityGroup.getEntityGroupData = function (name) {
            var parts = name.split('.');
            if (parts.length < 2)
                throw "ut.Streaming.StreamingService.getEntityGroupData: name entry is invalid";
            var shiftedParts = parts.shift();
            var initialData = entities[shiftedParts];
            if (initialData == undefined)
                throw "ut.Streaming.StreamingService.getEntityGroupData: name entry is invalid";
            return parts.reduce(function (v, p) {
                return v[p];
            }, initialData);
        };
        return EntityGroup;
    }());
    ut.EntityGroup = EntityGroup;
})(ut || (ut = {}));
var ut;
(function (ut) {
    var EntityLookupCache = /** @class */ (function () {
        function EntityLookupCache() {
        }
        EntityLookupCache.getByName = function (world, name) {
            var entity;
            if (name in this._cache) {
                entity = this._cache[name];
                if (world.exists(entity))
                    return entity;
            }
            entity = world.getEntityByName(name);
            this._cache[name] = entity;
            return entity;
        };
        EntityLookupCache._cache = {};
        return EntityLookupCache;
    }());
    ut.EntityLookupCache = EntityLookupCache;
})(ut || (ut = {}));
//# sourceMappingURL=tsc-emit.js.map