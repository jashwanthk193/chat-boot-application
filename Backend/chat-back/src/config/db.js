// import OracleDB from "oracledb";
// import dotenv from "dotenv";

// dotenv.config();

// class DatabaseHandler {
//   constructor() {
//     try {
//       if (process.env.LIBDIRPATH) {
//         OracleDB.initOracleClient({ libDir: process.env.LIBDIRPATH });
//       }
//       OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
//     } catch (err) {
//       console.error("Error initializing Oracle client", err);
//       throw err;
//     }

//     this.dbConfig = {
//       user: process.env.USER,
//       password: process.env.PASSWORD,
//       connectString: process.env.CONNECTIONSTRING, // must not be empty!
//       poolMin: 0,
//       poolMax: 20,
//       poolIncrement: 1,
//     };

//     this.pool = null;
//   }

//   async initializePool() {
//     if (!this.pool) {
//       try {
//         this.pool = await OracleDB.createPool(this.dbConfig);
//         console.log("Oracle connection pool created successfully");
//       } catch (err) {
//         console.error("Error creating connection pool", err);
//         throw err;
//       }
//     }
//   }

//   async getConnection() {
//     try {
//       if (!this.pool) await this.initializePool();
//       return await this.pool.getConnection();
//     } catch (err) {
//       console.error("Error getting connection from pool", err);
//       throw err;
//     }
//   }

//   async closePool() {
//     if (this.pool) {
//       try {
//         await this.pool.close(10);
//         console.log("Connection pool closed successfully");
//       } catch (err) {
//         console.error("Error closing connection pool", err);
//       }
//     }
//   }

//   async executeQueryWithParams(query, bindParams = {}) {
//     let connection;
//     try {
//       connection = await this.getConnection();
//       const result = await connection.execute(query, bindParams, { autoCommit: true });
//       return result;
//     } catch (err) {
//       console.error("Error executing query", err);
//       throw err;
//     } finally {
//       if (connection) {
//         try {
//           await connection.close();
//         } catch (err) {
//           console.error("Error closing connection", err);
//         }
//       }
//     }
//   }

//   async executeQueryWithoutParams(query) {
//     return this.executeQueryWithParams(query, {});
//   }

//   //   async fetchEmailConfirmationRecord(sl_no) {
//   //     const query = `SELECT * FROM email_confirmation WHERE SL_NO = :sl_no`;
//   //     const countQuery = `SELECT COUNT(*) AS COUNT FROM email_confirmation`;

//   //     const result = await this.executeQueryWithParams(query, { sl_no });
//   //     const countResult = await this.executeQueryWithoutParams(countQuery);

//   //     return {
//   //       maxCount: countResult.rows[0],
//   //       result: result.rows[0],
//   //     };
//   //   }

//   //   async updateEmailCount(sl_no) {
//   //     const query = `UPDATE email_confirmation SET COUNT = COUNT + 1 WHERE SL_NO = :sl_no`;
//   //     await this.executeQueryWithParams(query, { sl_no });
//   //   }

//   //   async resetEmailCount() {
//   //     const query = `UPDATE email_confirmation SET COUNT = 0`;
//   //     await this.executeQueryWithoutParams(query);
//   //   }

//   //   async executeMany(query, binds, options = {}) {
//   //     let connection;
//   //     try {
//   //       connection = await this.getConnection();
//   //       const result = await connection.executeMany(query, binds, {
//   //         autoCommit: true,
//   //         batchErrors: true,
//   //         ...options,
//   //       });
//   //       return result;
//   //     } catch (err) {
//   //       console.error("Error executing batch query", err);
//   //       throw err;
//   //     } finally {
//   //       if (connection) {
//   //         try {
//   //           await connection.close();
//   //         } catch (err) {
//   //           console.error("Error closing connection", err);
//   //         }
//   //       }
//   //     }
//   //   }
// }

// export { DatabaseHandler };
import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

export class DatabaseHandler {
  static pool = null;

  constructor() {
    try {
      // Initialize Oracle client (for Windows or Instant Client setups)
      if (process.env.LIBDIRPATH) {
        oracledb.initOracleClient({ libDir: process.env.LIBDIRPATH });
      }

      oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    } catch (err) {
      console.error("❌ Error initializing Oracle client:", err);
      throw err;
    }

    this.dbConfig = {
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECTIONSTRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
      poolTimeout: 300,         // 5 min idle timeout
      queueTimeout: 60000,      // wait 60s max for free connection
      stmtCacheSize: 30,        // cache prepared statements
      enableStatistics: true,   // debug pool usage
    };
  }

  async initializePool() {
    if (!DatabaseHandler.pool) {
      try {
        DatabaseHandler.pool = await oracledb.createPool(this.dbConfig);
        console.log("✅ Oracle connection pool created successfully");
      } catch (err) {
        console.error("❌ Error creating connection pool:", err);
        throw err;
      }
    }
  }

  async getConnection() {
    try {
      if (!DatabaseHandler.pool) {
        await this.initializePool();
      }
      const conn = await DatabaseHandler.pool.getConnection();
      return conn;
    } catch (err) {
      console.error("❌ Error getting Oracle connection:", err);
      throw err;
    }
  }

  async closePool() {
    if (DatabaseHandler.pool) {
      try {
        await DatabaseHandler.pool.close(10);
        console.log("🧹 Oracle connection pool closed cleanly");
      } catch (err) {
        console.error("❌ Error closing Oracle connection pool:", err);
      }
    }
  }

  async executeQueryWithParams(query, bindParams = {}) {
    let connection;
    try {
      connection = await this.getConnection();
      const result = await connection.execute(query, bindParams, { autoCommit: true });
      return result;
    } catch (err) {
      console.error("❌ Error executing query:", err);
      throw err;
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error("⚠️ Error closing Oracle connection:", err);
        }
      }
    }
  }

  async executeQueryWithoutParams(query) {
    return this.executeQueryWithParams(query, {});
  }
}
