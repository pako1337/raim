using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaCode.Raim.Model
{
    public class BoundingBox
    {
        public double Bottom { get; private set; }
        public double Left { get; private set; }
        public double Right { get; private set; }
        public double Top { get; private set; }

        public double Width {  get { return Right - Left; } }
        public double Height {  get { return Top - Bottom; } }

        public BoundingBox(double top, double right, double bottom, double left)
        {
            Top = top;
            Right = right;
            Bottom = bottom;
            Left = left;
        }

        public bool Intersects(BoundingBox b)
        {
            return !(Right < b.Left &&
                     Left > b.Right &&
                     Bottom > b.Top &&
                     Top < b.Bottom);
        }
    }
}