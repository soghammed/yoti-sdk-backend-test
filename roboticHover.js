class RoboticHover {

	constructor(input){
		this.specs = input;
		if((typeof this.specs).trim() == "string"){
			// console.log('parsing json');
			this.specs = JSON.parse(this.specs);
		}
		this.currentPosition = this.specs.coords;
		this.output = {
			"coords": this.currentPosition,
			"patches": 0
		};
		this.room = [];
		this.roomInit = () => {
			for(var x = 0; x < this.specs.roomSize[1]; x++){
				this.room[x] = [];
				for(var y = 0; y < this.specs.roomSize[0]; y++){
					let coords = [x,y];
					let isRobotInitPosition = this.specs.coords[0] == x ? this.specs.coords[1] == y ? 1 : null: null;
					//R = RobotPosition, C = Clean
					this.room[x][y] = isRobotInitPosition ? "R" : "C";
				}
			}
		}
		this.addPatchesToRoom = () => {
			this.specs.patches.forEach(patchCoord => {
				//D = Dirty
				this.room[patchCoord[0]][patchCoord[1]] = "D";
			});
		}
		this.move = (direction) => {
			//90Degree clockwise direction rotation as per test spec;
			switch(direction)
			{
				case "N": 
					this.interact.E();
					break;

				case "S": 
					this.interact.W();
					break;

				case "E": 
					this.interact.S();
					break;

				case "W": 
					this.interact.N();
					break;
			}
		}
		this.cleanPatch = (x,y) => {
			this.room[x][y] = "C";
			this.output.patches+=1;
		}
		this.locateRobotHover = () => {
			this.room[this.currentPosition[0]][this.currentPosition[1]] = "R";
		}
		this.isMovingRobotPossible = (direc) => {
			let roomX = this.room.length;
			let roomY = this.room[this.currentPosition[1]].length;
			switch(direc){
				case "E":
					return this.currentPosition[1] == (this.room[this.currentPosition[1]].length - 1) ? null : 1;
					break;

				case "W":
					return this.currentPosition[1] == 0 ? null : 1;
					break;

				case "N":
					return this.currentPosition[0] == 0 ? null : 1;
					break;

				case "S":
					return this.currentPosition[0] == (this.room.length - 1) ? null : 1;
					break;

			}
				// }
		}
		this.doesNewCoordNeedCleaning = (x,y) => {
			return this.room[x][y] == "D";
		}
		this.updateOldRobotPosition = () => {
			this.room[this.currentPosition[0]][this.currentPosition[1]] = "C";
			return 1;
		}
		this.handleRobotMove = (newX, newY) => {
			if(this.doesNewCoordNeedCleaning(newX,newY)){
				this.cleanPatch(newX, newY);
			}
			//update old position and new position and currentPosition;
			this.updateOldRobotPosition();
			//update current new position;
			this.currentPosition = [newX, newY];
			this.locateRobotHover();
		}
		this.interact = {
			N: () => {
				if(this.isMovingRobotPossible("N")){
					let newX = this.currentPosition[0] - 1;
					let newY = this.currentPosition[1];
					this.handleRobotMove(newX, newY);
				}else{
					console.log('move not possible');
				}
			},
			S: () => {
				if(this.isMovingRobotPossible("S")){
					let newX = this.currentPosition[0] + 1;
					let newY = this.currentPosition[1];
					this.handleRobotMove(newX, newY);
				}else{
					console.log('move not possible');
				}
			},
			E: () => {
				if(this.isMovingRobotPossible("E")){
					let newX = this.currentPosition[0];
					let newY = this.currentPosition[1]+1;
					this.handleRobotMove(newX, newY);
				}else{
					console.log('move not possible');
				}
			},
			W: () => {
				if(this.isMovingRobotPossible("W")){
					let newX = this.currentPosition[0];
					let newY = this.currentPosition[1] - 1;
					this.handleRobotMove(newX, newY);
				}else{
					console.log('move not possible');
				}
			}
		}
		this.isPatched = (coords) => {
			return this.room[coords[1]][coords[0]] == "D";
		}
		this.robotPleaseCleanTheRoom = () => {
			this.specs.instructions.split('').forEach(direction => {
					this.move(direction);
			});
			this.output.coords = this.room[this.currentPosition[0]][this.currentPosition[1]] == "R" ? this.currentPosition : null;
			return this.output;
		}
		this.runService = () => {
			this.roomInit();
			this.addPatchesToRoom();
			let result = this.robotPleaseCleanTheRoom();
			return result;
			// let resultJSONFormat = JSON.stringify(result);
			// return resultJSONFormat;
		}

		//run
		this.runService();
	}

}

module.exports = RoboticHover;