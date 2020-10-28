using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MeetingService.Contracts
{
    public class MeetingInfo
    {

        public IEnumerable<string> Participants { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
