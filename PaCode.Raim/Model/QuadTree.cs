using System;
using System.Collections.Generic;
using System.Linq;

namespace PaCode.Raim.Model
{
    public class QuadTree
    {
        private const int MaxTreeLevel = 4;
        private BoundingBox _area;
        private int _level;
        private QuadTree[] _nodes;
        private List<Obstacle> _objects;

        public QuadTree(BoundingBox area) : this(area, 0) { }

        public QuadTree(BoundingBox area, int level)
        {
            _level = level;
            _area = area;
            _nodes = new QuadTree[4];
            _objects = new List<Obstacle>(10);
        }

        public void Insert(Obstacle obj)
        {
            if (_nodes[0] != null)
            {
                int index = GetIndex(obj);
                if (index != -1)
                {
                    _nodes[index].Insert(obj);
                    return;
                }
            }

            _objects.Add(obj);

            if (_objects.Count > 4 && _level < MaxTreeLevel)
            {
                if (_nodes[0] == null)
                    Split();

                int i = 0;
                while (i < _objects.Count)
                {
                    int index = GetIndex(_objects[i]);
                    if (index != -1)
                    {
                        Obstacle objToMove = _objects[i];
                        _objects.Remove(objToMove);
                        _nodes[index].Insert(objToMove);
                    }
                    else
                        i++;
                }
            }
        }

        public IReadOnlyList<Obstacle> GetObjects(Obstacle obj)
        {
            var all = new List<Obstacle>(_objects);
            all.AddRange(GetChildObjects(obj));
            all.Remove(obj);
            return all;
        }

        private IReadOnlyList<Obstacle> GetChildObjects(Obstacle obj)
        {
            if (_nodes[0] == null)
                return new Obstacle[0];

            int index = GetIndex(obj);
            if (index != -1)
            {
                return _nodes[index].GetObjects(obj);
            }
            else
            {
                var all = new List<Obstacle>();
                for (int i = 0; i < _nodes.Length; i++)
                    all.AddRange(_nodes[i].GetObjects());

                return all;
            }
        }

        public IReadOnlyList<Obstacle> GetObjects()
        {
            var all = new List<Obstacle>(_objects);
            if (_nodes[0] != null)
                for (int i = 0; i < _nodes.Length; i++)
                    all.AddRange(_nodes[i].GetObjects());

            return all;
        }

        private void Split()
        {
            var subWidth = (_area.Width / 2);
            var subHeight = (_area.Height / 2);

            // 1 | 0
            // -----
            // 2 | 3
            _nodes[0] = new QuadTree(new BoundingBox(_area.Top, _area.Right, _area.Bottom + subHeight, _area.Left + subWidth), _level + 1);
            _nodes[1] = new QuadTree(new BoundingBox(_area.Top, _area.Left + subWidth, _area.Bottom + subHeight, _area.Left), _level + 1);
            _nodes[2] = new QuadTree(new BoundingBox(_area.Bottom + subHeight, _area.Left + subWidth, _area.Bottom, _area.Left), _level + 1);
            _nodes[3] = new QuadTree(new BoundingBox(_area.Bottom + subHeight, _area.Right, _area.Bottom, _area.Left + subWidth), _level + 1);
        }

        private int GetIndex(Obstacle obj)
        {
            int index = -1;
            var vMid = _area.Left + (_area.Width / 2);
            var hMid = _area.Bottom + (_area.Height / 2);

            BoundingBox box = obj.BoundingBox;

            bool topHalf = box.Bottom > hMid;
            bool bottomHalf = box.Top < hMid;
            var leftHalf = box.Right < vMid;
            var rightHalf = box.Left > vMid;

            if (leftHalf)
            {
                if (topHalf)
                    index = 1;
                else if (bottomHalf)
                    index = 2;
            }
            else
            {
                if (rightHalf)
                {
                    if (topHalf)
                        index = 0;
                    else if (bottomHalf)
                        index = 3;
                }
            }

            return index;
        }
    }
}