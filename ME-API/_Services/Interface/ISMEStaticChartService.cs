using System.Threading.Tasks;
using ME_API.DTO;
namespace ME_API._Services.Interface

{
    public interface ISMEStaticChartService
    {
        Task<SMEStaticChartDto> GetFactoryTree();

        Task<object> GetDataChart(string id , int type);
    }
}