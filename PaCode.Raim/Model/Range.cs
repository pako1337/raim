using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace PaCode.Raim.Model
{
    [DebuggerDisplay("{Start}, {End}")]
    public class Range
    {
        public double Start { get; set; }
        public double End { get; set; }
        public double Length { get; private set; }

        public Range(double start, double end)
        {
            Start = start;
            End = end;
            Length = end - start;
        }

        public Range Intersect(Range other)
        {
            var firstRange = Start < other.Start ? this : other;
            var secondRange = firstRange == this ? other : this;

            if (firstRange.End < secondRange.Start)
                return new Range(0, 0);

            return new Range(secondRange.Start, firstRange.End);
        }

        public Range Add(double value)
        {
            return new Range(Start + value, End + value);
        }
    }
}