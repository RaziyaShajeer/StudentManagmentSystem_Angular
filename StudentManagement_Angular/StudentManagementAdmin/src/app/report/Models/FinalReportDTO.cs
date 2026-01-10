using System.Collections.Generic;

namespace Domain.Services.Admin.DTOs
{
    public class FinalReportDTO
    {
        public double? TotalAmountPaid { get; set; }
        public double TotalBalanceAmount { get; set; }
        public double? TotalDueAmount { get; set; }
        public double? TotalFees { get; set; }

        public List<StudentIndividualFee> StudentIndividualFees { get; set; }
            = new List<StudentIndividualFee>();
    }
}
