export default class calculate {

    pausePromise
    pauseResolve
    iterations
    shouldStop

    constructor(combedList,skillList,targetSkillList,sortedCoreList,subSkillList,superposition,minCores,plusCores,_getResult){
        this.list = combedList
        this.skillList = skillList
        this.targetSkillList = targetSkillList
        this.sortedCoreList = sortedCoreList
        this.subSkillList = subSkillList
        this.superposition = superposition
        this.cores = minCores + plusCores
        this.iterations = 0
        this._getResult = _getResult
        
        this.initialCnts = new Array(this.skillList.length).fill(0)
        for(let skill of this.list){
            this.initialCnts[skill]++
        }
    }

    async solve(){
        this.remain = this.cores * 3 - this.targetSkillList.length * this.superposition
        await this.solver()
    }

    async solver(){

        let stack = [{
            list:[],
            cnts: this.initialCnts,
            index:0
        }]

        while(stack.length){
            if(this.shouldStop) return

            let {list,cnts,index} = stack.pop()
            let sortedCnts = this.sortedCnts(cnts)
            this.iterations++

            if(index == this.list.length){
                if(!sortedCnts.target.filter(v => v < this.superposition).length){
                    if(!sortedCnts.sub.filter(v => v == 0 || v >= this.superposition).length){
                        this._getResult(this.list,list)
                    }
                }
                continue
            }
            if(sortedCnts.target.filter(v => v > this.superposition).length) continue
            if(sortedCnts.sub.filter(v => v >= this.superposition).length) continue
            if(this.remain - sortedCnts.subSum - sortedCnts.notTarget < 0) continue

            let possibleSkillList = this.possibleSkill(sortedCnts,this.list[index])
            let combPossibleSkillList = this.combPossibleSkill(possibleSkillList)

            for(let target of combPossibleSkillList){
                if(this.existenceCore(target,this.list[index])){
                    let next = {
                        list:[...list,target],
                        index:index+1,
                        cnts: (() => {
                            let result = cnts.slice()
                            result[target[0]]++
                            result[target[1]]++
                            return result
                        })()
                    }
                    stack[stack.length] = next
                }
            }
            
            await new Promise(resolve => setTimeout(resolve,0))
            await this.pausePromise
        }

        return true
    }

    sortedCnts = (cnts) => {
        let target = []
        let sub = []
        let subSum = 0
        let notTarget = 0
        cnts.forEach((v,i) => {
            if(this.targetSkillList.indexOf(i) != -1){
                target[this.targetSkillList.indexOf(i)] = v
            } else if(this.subSkillList.indexOf(i) != -1){
                sub[this.subSkillList.indexOf(i)] = v
                subSum += v
            } else notTarget += v
        })
        return {target,sub,subSum,notTarget}
    }
    
    possibleSkill = (sortedCnts,index) => {
        let result = []
        this.targetSkillList
        .filter((_,i) => sortedCnts.target[i] < this.superposition)
        .forEach(v => result[result.length] = v)
        this.subSkillList
        .filter((_,i) => sortedCnts.sub[i] < this.superposition - 1)
        .forEach(v => result[result.length] = v)
        if(this.remain - sortedCnts.subSum - sortedCnts.notTarget > 0){
            for(let i=0;i<this.skillList.length;i++){
                if(!this.targetSkillList.includes(i) &&
                !this.subSkillList.includes(i)) result[result.length] = i
            }
        }

        if(result.indexOf(index) != -1) result.splice(result.indexOf(index),1)

        return result.sort((a,b) => a - b)
    }

    combPossibleSkill = (possibleSkillList) => {
        let combedList = []

        const comb = (result,index,n,r,target) => {
            if(r == 0) combedList[combedList.length] = [possibleSkillList[result[0]],possibleSkillList[result[1]]]
            else if(target == n) return
            else {
                result[index] = target
                comb([...result],index+1,n,r-1,target+1)
                comb([...result],index,n,r,target+1)
            }
        }
        comb([],0,possibleSkillList.length,2,0)

        return combedList
    }

    existenceCore = (target,index) => {
        for(let core of this.sortedCoreList[index]){
            if(core[0] == target[0] || core[1] == target[1]) return true
            if(core[0] == target[1] || core[1] == target[0]) return true
        }
        return false
    }

    pause = () => {
        this.pausePromise = new Promise(resolve => this.pauseResolve = resolve)
    }

    continue = () => {
        this.pauseResolve()
        this.pausePromise = null
    }

    stop = () => {
        this.shouldStop = true
    }
}