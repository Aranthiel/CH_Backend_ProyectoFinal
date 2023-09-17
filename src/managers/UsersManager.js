import fs from 'fs'

export class UsersManager{
    

    constructor(path){ 
        this.path=path;     
    }
    
    async getUsers(){
        try {
        } catch (error) {
            return error
        }
    };
    
    async getUsersById(usersId){
        try {
        } catch (error) {
            return error
        }
    };    
    
    async addUsers(obj){
        try {
        } catch (error) {
            return error
        }
    };
    
    async updateUsers(userId, newValue){
        try {
        } catch (error) {
            return error
        }
    };    
    
    async deleteUsers(userId){
        try {
        } catch (error) {
            return error
        }
    };
}

export const usersManager= new UsersManager('Userss.json');
