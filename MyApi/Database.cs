using System;
using System.Collections.Generic;
using System.IO;
using Microsoft.Data.Sqlite;

namespace MyApi{
    public class Database{
        private static readonly string DbPath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "parking.db"));
        private string cs = $"Data Source={DbPath}";

        public List<User> GetUsers()
        {
            string stm = "SELECT * FROM Users";
            List<User> users = new List<User>();
            using var con = new SqliteConnection(cs);
            con.Open();
            using var cmd = new SqliteCommand(stm, con);
            using SqliteDataReader rdr = cmd.ExecuteReader();
            while(rdr.Read()){
                users.Add(new User{ Id = rdr.GetInt32(0), Username = rdr.GetString(1), Password = rdr.GetString(2), CarModel = rdr.GetString(3), CarColor = rdr.GetString(4)
                });
            }
            return users;
        }
        
        public User InsertUser(User user)
        {
            using var con = new SqliteConnection(cs);
            con.Open();

            using var cmd = new SqliteCommand(@"INSERT INTO Users (Username, Password, CarModel, CarColor)
                                               VALUES ($username, $password, $carModel, $carColor);
                                               SELECT last_insert_rowid();", con);
            cmd.Parameters.AddWithValue("$username", user.Username);
            cmd.Parameters.AddWithValue("$password", user.Password);
            cmd.Parameters.AddWithValue("$carModel", user.CarModel);
            cmd.Parameters.AddWithValue("$carColor", user.CarColor);

            var result = cmd.ExecuteScalar();
            if (result is long newId)
            {
                user.Id = (int)newId;
            }
            return user;
        }
        
    }
}
