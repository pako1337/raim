using System;
using System.Collections.Generic;
using System.Linq;

namespace PaCode.Raim.Model
{
    public class Range
    {
        public double Start { get; set; }
        public double End { get; set; }
        public double Length { get { return End - Start; } }

        public Range(double a, double b)
        {
            Start = a < b ? a : b;
            End = a < b ? b : a;
        }

        public Range Intersect(Range other)
        {
            var firstRange = Start < other.Start ? this : other;
            var secondRange = firstRange == this ? other : this;

            if (firstRange.End < secondRange.Start)
                return new Range(0, 0);

            return new Range(secondRange.Start, firstRange.End);
        }
    }
}