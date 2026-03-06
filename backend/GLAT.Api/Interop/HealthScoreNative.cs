using System.Runtime.InteropServices;

namespace GLAT.Api.Interop
{
    public static class HealthScoreNative
    {
        [DllImport("healthscore", CallingConvention = CallingConvention.Cdecl, EntryPoint = "calculate_health_score")]
        public static extern double CalculateHealthScore(
            double temperature,
            double batteryLevel,
            double vibration
        );
    }
}