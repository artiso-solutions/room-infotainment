using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using MeetingService.Contracts;
using Microsoft.Exchange.WebServices.Data;

namespace MeetingService.Services
{
    public class ExchangeMeetingService
    {
        public async Task<IEnumerable<ScheduledMeeting>> GetAllMeetingsForToday()
        {
			ServicePointManager.ServerCertificateValidationCallback = CertificateValidationCallBack;
			ExchangeService service = new ExchangeService(ExchangeVersion.Exchange2016);
			service.Credentials = new WebCredentials("Gen_Art_User1@artiso.com", "Admin2010");

			service.AutodiscoverUrl("Gen_Art_User1@artiso.com", RedirectionUrlValidationCallback);

			//service.UseDefaultCredentials = true;
			//service.TraceEnabled = true;
			//service.TraceFlags = TraceFlags.All;

			Mailbox primary = new Mailbox("Gen_Art_Room@artiso.com");
			var primaryCalendar = await CalendarFolder.Bind(service, new FolderId(WellKnownFolderName.Calendar, primary));

			// Limit the result set to 10 items.
			var startTime = DateTime.Now.Date;
			var endTime = startTime.AddDays(1);

			var view = new CalendarView(startTime, endTime, 100);
			view.PropertySet = new PropertySet(ItemSchema.Subject,
											   ItemSchema.DateTimeReceived,
											   EmailMessageSchema.IsRead);
			// Item searches do not support deep traversal.
			view.Traversal = ItemTraversal.Shallow;

			var z = await primaryCalendar.FindAppointments(view);

			var propSet = new PropertySet(ItemSchema.Subject,
											   ItemSchema.DateTimeReceived,
											   ItemSchema.TextBody,
											   AppointmentSchema.Organizer,
											   AppointmentSchema.Duration,
											   AppointmentSchema.Start,
											   AppointmentSchema.StartTimeZone,
											   AppointmentSchema.End,
											   AppointmentSchema.EndTimeZone,
											   AppointmentSchema.Location,
											   AppointmentSchema.AdjacentMeetingCount,
											   AppointmentSchema.RequiredAttendees,
											   AppointmentSchema.OptionalAttendees,
											   EmailMessageSchema.From,
											   EmailMessageSchema.IsRead);
			await service.LoadPropertiesForItems(z, propSet);
			//z.Dump();
			//
			var meetings = z.Select(m => new
			{
				Id = m.Id.UniqueId,
				Subject = m.Subject,
				Body = m.TextBody,
				Organizer = m.Organizer,
				Duration = m.Duration,
				StartTime = m.Start,
				EndTime = m.End,
				Particiants = m.RequiredAttendees.Concat(m.OptionalAttendees)
			});

            var mList = meetings.Select(m => new ScheduledMeeting()
            {
                Id = m.Id, Subject = m.Subject, StartTime = m.StartTime, EndTime = m.EndTime
            });

            return mList;
        }

        public async Task<MeetingInfo> GetMeetingInfo(string meetingId)
        {
			ServicePointManager.ServerCertificateValidationCallback = CertificateValidationCallBack;
			ExchangeService service = new ExchangeService(ExchangeVersion.Exchange2016);
			service.Credentials = new WebCredentials("Gen_Art_User1@artiso.com", "Admin2010");

			service.AutodiscoverUrl("Gen_Art_User1@artiso.com", RedirectionUrlValidationCallback);

			//service.UseDefaultCredentials = true;
			//service.TraceEnabled = true;
			//service.TraceFlags = TraceFlags.All;

			Mailbox primary = new Mailbox("Gen_Art_Room@artiso.com");
			var primaryCalendar = await CalendarFolder.Bind(service, new FolderId(WellKnownFolderName.Calendar, primary));

			// Limit the result set to 10 items.
			var startTime = DateTime.Now.Date;
			var endTime = startTime.AddDays(1);

			var view = new CalendarView(startTime, endTime, 100);
			view.PropertySet = new PropertySet(ItemSchema.Subject,
											   ItemSchema.DateTimeReceived,
											   EmailMessageSchema.IsRead);
			// Item searches do not support deep traversal.
			view.Traversal = ItemTraversal.Shallow;

			var z = await primaryCalendar.FindAppointments(view);

			var propSet = new PropertySet(ItemSchema.Subject,
											   ItemSchema.DateTimeReceived,
											   ItemSchema.TextBody,
											   AppointmentSchema.Organizer,
											   AppointmentSchema.Duration,
											   AppointmentSchema.Start,
											   AppointmentSchema.StartTimeZone,
											   AppointmentSchema.End,
											   AppointmentSchema.EndTimeZone,
											   AppointmentSchema.Location,
											   AppointmentSchema.AdjacentMeetingCount,
											   AppointmentSchema.RequiredAttendees,
											   AppointmentSchema.OptionalAttendees,
											   EmailMessageSchema.From,
											   EmailMessageSchema.IsRead);
			await service.LoadPropertiesForItems(z, propSet);
			//z.Dump();
			//
			var meetings = z.Select(m => new
			{
				Id = m.Id.UniqueId,
				Subject = m.Subject,
				Body = m.TextBody,
				Organizer = m.Organizer,
				Duration = m.Duration,
				StartTime = m.Start,
				EndTime = m.End,
				Particiants = m.RequiredAttendees.Concat(m.OptionalAttendees)
			});

            var meeting = meetings.Single(m => m.Id == meetingId);

			return new MeetingInfo
            {
				Body = meeting.Body.Text,
				Subject = meeting.Subject,
				Participants = meeting.Particiants.Select(p => p.Address)
            };
		}

		private static bool RedirectionUrlValidationCallback(string redirectionUrl)
		{
			// The default for the validation callback is to reject the URL.
			bool result = false;

			Uri redirectionUri = new Uri(redirectionUrl);

			// Validate the contents of the redirection URL. In this simple validation
			// callback, the redirection URL is considered valid if it is using HTTPS
			// to encrypt the authentication credentials. 
			if (redirectionUri.Scheme == "https")
			{
				result = true;
			}
			return result;
		}

		private static bool CertificateValidationCallBack(
		object sender,
		System.Security.Cryptography.X509Certificates.X509Certificate certificate,
		System.Security.Cryptography.X509Certificates.X509Chain chain,
		System.Net.Security.SslPolicyErrors sslPolicyErrors)
		{
			// If the certificate is a valid, signed certificate, return true.
			if (sslPolicyErrors == System.Net.Security.SslPolicyErrors.None)
			{
				return true;
			}

			// If there are errors in the certificate chain, look at each error to determine the cause.
			if ((sslPolicyErrors & System.Net.Security.SslPolicyErrors.RemoteCertificateChainErrors) != 0)
			{
				if (chain != null && chain.ChainStatus != null)
				{
					foreach (System.Security.Cryptography.X509Certificates.X509ChainStatus status in chain.ChainStatus)
					{
						if ((certificate.Subject == certificate.Issuer) &&
						   (status.Status == System.Security.Cryptography.X509Certificates.X509ChainStatusFlags.UntrustedRoot))
						{
							// Self-signed certificates with an untrusted root are valid. 
							continue;
						}
						else
						{
							if (status.Status != System.Security.Cryptography.X509Certificates.X509ChainStatusFlags.NoError)
							{
								// If there are any other errors in the certificate chain, the certificate is invalid,
								// so the method returns false.
								return false;
							}
						}
					}
				}

				// When processing reaches this line, the only errors in the certificate chain are 
				// untrusted root errors for self-signed certificates. These certificates are valid
				// for default Exchange server installations, so return true.
				return true;
			}
			else
			{
				// In all other cases, return false.
				return false;
			}
		}
	}
}