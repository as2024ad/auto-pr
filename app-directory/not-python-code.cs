using System;
using System.Data.SqlClient;
using System.IO;

namespace InsecureApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("Enter your username: ");
            string username = Console.ReadLine();

            // Vulnerability: SQL Injection
            string connectionString = "Server=myServerAddress;Database=myDataBase;User Id=myUsername;Password=myPassword;";
            string query = "SELECT * FROM Users WHERE Username = '" + username + "'";

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand command = new SqlCommand(query, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                
                while (reader.Read())
                {
                    Console.WriteLine($"{reader["Username"]}: {reader["Password"]}");
                }
            }

            Console.Write("Enter file path to read: ");
            string filePath = Console.ReadLine();

            // Vulnerability: Path Traversal
            string fileContent = File.ReadAllText(filePath);
            Console.WriteLine(fileContent);
        }
    }
}
