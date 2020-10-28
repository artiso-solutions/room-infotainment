using System;

namespace MeetingService.Services
{
    public class GreetingService
    {
        private readonly Random random = new Random();

        private readonly string[] greetings = new[]
        {
            "Herzlich Willkommen",
            "Hallo Zusammen",
            "Guten Morgen",
            "Welcome everyone",
            "Bienvenue tout le monde",
            "Benvenuti a tutti"
        };

        public string GetRandomHelloMessage()
        {
            var randomIndex = random.Next(0, greetings.Length);
            return greetings[randomIndex];
        }
    }
}