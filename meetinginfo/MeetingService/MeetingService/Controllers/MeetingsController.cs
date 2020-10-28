using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MeetingService.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MeetingService.Controllers
{
    [Route("meetings")]
    [ApiController]
    public class MeetingsController : ControllerBase
    {
        [HttpGet]
        [Route("all")]
        public IEnumerable<ScheduledMeeting> GetAllMeetings()
        {
            var list = new List<ScheduledMeeting>();
            list.Add(new ScheduledMeeting(){Id="hallo"});
            return list;
        }

        [HttpGet]
        [Route("helloMessage")]
        public HelloMessage GetHelloMessage()
        {
            return new HelloMessage() {Message = "Herzlich Willkommen"};
        }

        [HttpPost]
        [Route("meetingInfo")]
        public MeetingInfo GetMeetingInfo([FromBody] RequestWithId request)
        {
            var id = request.Id;
            return new MeetingInfo();
        }
    }


}
