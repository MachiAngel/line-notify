

const { USERS_TABLE_STRING } = require('../constants/tableSchema')


class UserModel {

  /** @description add user from line
  * @param {object} line user object
  * @param {object} Knex
  * @return {boolen} return user if add success and exist or empty
  */
  async addLineUserToPGDB(user, pgdb) {
    const { 
      userId: line_userId, 
      displayName: line_displayName, 
      pictureUrl: line_pictureUrl, 
      statusMessage: line_statusMessage 
    } = user

    try {
      const isHavingUser = await pgdb(USERS_TABLE_STRING).where('line_userId', '=', line_userId).returning('*')

      if (isHavingUser.length) {
        //更新
        const updateResult = await pgdb(USERS_TABLE_STRING)
          .update({
            line_displayName,
            line_pictureUrl,
            line_statusMessage,
            status:'1',
            updated_at: new Date() 
          })
          .where('line_userId', '=', line_userId)
          .returning('*')

        if (!updateResult.length) {
          throw new Error(`update user: ${line_userId} fail`)
        }

        return updateResult[0]
      } else {
        //insert
        const insertResults = await pgdb.insert({
          line_userId,
          line_displayName,
          line_pictureUrl,
          line_statusMessage
        })
          .into(USERS_TABLE_STRING)
          .returning('*')

        return insertResults[0] 
      }
    } catch (e) {
      console.log(e)
      return {} 
    }

  }


  /** @description edit user 
  * @param {userId} line_userId
  * @param {object} update obejct
  * @param {object} Knex
  * @return {boolen} return user if edit success or empty
  */
  async editLineUserToPGDB(line_userId, update = {}, pgdb) {
    

    try {
      const updateResult = await pgdb(USERS_TABLE_STRING)
        .update(update)
        .where('line_userId', '=', line_userId)
        .returning('*')
      return updateResult[0]

    } catch (e) {
      console.log(e)
      return {}
    }

  }

}


module.exports = new UserModel()
