const sql = require('mssql');
const dbConfig = require("../dbConfig");

class User {
    constructor(id, username, email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    static async createUser(user) {
        const pool = await sql.connect(dbConfig);
        try {
            const result = await pool.request()
                .input('username', sql.NVarChar, user.username)
                .input('email', sql.NVarChar, user.email)
                .query(`
                    INSERT INTO Users (username, email)
                    VALUES (@username, @email);
                    SELECT * FROM Users WHERE id = SCOPE_IDENTITY();
                `);

            return result.recordset[0];
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        } finally {
            pool && pool.close();
        }
    }

    static async getAllUsers() {
        const pool = await sql.connect(dbConfig);
        try {
            const result = await pool.request().query('SELECT * FROM Users');
            return result.recordset;
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        } finally {
            pool && pool.close();
        }
    }

    static async getUserById(id) {
        const pool = await sql.connect(dbConfig);
        console.log("User ID:", id);
        try {
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query('SELECT * FROM Users WHERE id = @id');
            return result.recordset[0] || null;
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        } finally {
            pool && pool.close();
        }
    }

    static async updateUser(id, updatedUser) {
        const pool = await sql.connect(dbConfig);
        try {
            await pool.request()
                .input('id', sql.Int, id)
                .input('username', sql.NVarChar, updatedUser.username)
                .input('email', sql.NVarChar, updatedUser.email)
                .query(`
                    UPDATE Users
                    SET username = @username, email = @email
                    WHERE id = @id
                `);
            return { message: 'User updated successfully' };
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        } finally {
            pool && pool.close();
        }
    }

    static async deleteUser(id) {
        const pool = await sql.connect(dbConfig);
        try {
            await pool.request()
                .input('id', sql.Int, id)
                .query('DELETE FROM Users WHERE id = @id');
            return { message: 'User deleted successfully' };
        } catch (err) {
            console.error('SQL error', err);
            throw err;
        } finally {
            pool && pool.close();
        }
    }

    static async searchUsers(searchTerm) {
        const pool = await sql.connect(dbConfig);
        try {
            const query = `
                SELECT *
                FROM Users
                WHERE username LIKE @searchTerm
                  OR email LIKE @searchTerm
            `;
            const result = await pool.request()
                .input('searchTerm', sql.NVarChar, `%${searchTerm}%`)
                .query(query);
            return result.recordset;
        } catch (error) {
            console.error('SQL error', error);
            throw new Error("Error searching users");
        } finally {
            pool && pool.close();
        }
    }

    static async getUsersWithBooks() {
        const pool = await sql.connect(dbConfig);
        try {
            const query = `
                SELECT u.id AS user_id, u.username, u.email, b.id AS book_id, b.title, b.author
                FROM Users u
                LEFT JOIN UserBooks ub ON ub.user_id = u.id
                LEFT JOIN Books b ON ub.book_id = b.id
                ORDER BY u.username;
            `;
            const result = await pool.request().query(query);
            const usersWithBooks = {};
            for (const row of result.recordset) {
                const userId = row.user_id;
                if (!usersWithBooks[userId]) {
                    usersWithBooks[userId] = {
                        id: userId,
                        username: row.username,
                        email: row.email,
                        books: [],
                    };
                }
                usersWithBooks[userId].books.push({
                    id: row.book_id,
                    title: row.title,
                    author: row.author,
                });
            }
            return Object.values(usersWithBooks);
        } catch (error) {
            console.error('SQL error', error);
            throw new Error("Error fetching users with books");
        } finally {
            pool && pool.close();
        }
    }
}

module.exports = User;
