#include "healthscore.h"

double calculate_health_score(double temperature, double batteryLevel, double vibration)
{
    double score = 100.0;

    if (temperature > 20.0)
    {
        score -= 30.0;
    }

    if (batteryLevel < 20.0)
    {
        score -= 40.0;
    }

    if (vibration > 0.8)
    {
        score -= 20.0;
    }

    if (score < 0.0)
    {
        score = 0.0;
    }

    return score;
}