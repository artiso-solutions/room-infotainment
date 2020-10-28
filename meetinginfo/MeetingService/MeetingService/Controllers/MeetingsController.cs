using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MeetingService.Contracts;
using MeetingService.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MeetingService.Controllers
{
    [Route("meetings")]
    [ApiController]
    public class MeetingsController : ControllerBase
    {
        private readonly GreetingService greetingService;
        private readonly ExchangeMeetingService meetingService;

        public MeetingsController(GreetingService greetingService, ExchangeMeetingService meetingService)
        {
            this.greetingService = greetingService;
            this.meetingService = meetingService;
        }

        [HttpGet]
        [Route("all")]
        public async Task<IEnumerable<ScheduledMeeting>> GetAllMeetings()
        {
            var meetings = await meetingService.GetAllMeetingsForToday();
            return meetings;
        }

        [HttpGet]
        [Route("helloMessage")]
        public HelloMessage GetHelloMessage()
        {
            var greeting = greetingService.GetRandomHelloMessage();
            return new HelloMessage {Message = greeting};
        }

        [HttpPost]
        [Route("meetingInfo")]
        public async Task<MeetingInfo> GetMeetingInfo([FromBody] RequestWithId request)
        {
            var id = request.Id;
            var meetingInfo = await meetingService.GetMeetingInfo(id);
            return meetingInfo;
        }
    }


}
