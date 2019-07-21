import React, {Component} from 'react';
import './ad-pattern-lock.css';
import {getLengthAngle, getPattern, getPointID} from "./util";

class AdPatternLock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            path: [],
            currentPoint: null,
            lastVisitedPointID: null,
            offsetTop: null,
            offsetLeft: null
        };
        this.patternHolder = React.createRef();
    }

    _onStart = (e) => {
        e.preventDefault();

        this.moveEvent = e.type === 'touchstart' ? 'touchmove' : 'mousemove';
        this.endEvent = e.type === 'touchstart' ? 'touchend' : 'mouseup';

        this.patternHolder.current.addEventListener(this.moveEvent, this._onMove);
        document.addEventListener(this.endEvent, this._onEnd);

        this.reset();
    };

    _onMove = (e) => {
        e.preventDefault();
        const {offsetTop, offsetLeft, lastVisitedPointID} = this.state;
        const {matrix, patternCircleRadius, patternCircleMargin, patternDotsRadius} = this.props;

        let xi = e.clientX || e.touches[0].clientX;
        let yi = e.clientY || e.touches[0].clientY;
        const point = getPointID(xi - offsetLeft, yi - offsetTop, patternCircleRadius, patternCircleMargin, matrix, patternDotsRadius);
        let x, y;
        if (!Number.isNaN(parseInt(point.id)) && point.id !== lastVisitedPointID) {
            x = point.x + this.state.offsetLeft;
            y = point.y + this.state.offsetTop;
        } else {
            x = xi;
            y = yi;
        }

        this.updatePath(point.id, x, y);
    };

    _onEnd = (e) => {
        const {onCompletePattern, delimeter, minimumPatternLength} = this.props;
        const {path} = this.state;
        if (onCompletePattern && path.length >= minimumPatternLength) {
            onCompletePattern(getPattern(path, delimeter));
        }

        this.setState({
            currentPoint: null
        });
        this.patternHolder.current.removeEventListener(this.moveEvent, this._onMove);
        document.removeEventListener(this.endEvent, this._onEnd);
    };

    updatePath = (id, x, y) => {
        const {path, lastVisitedPointID} = this.state;
        const {allowRepeat} = this.props;
        if (!Number.isNaN(parseInt(id)) && id !== lastVisitedPointID && (allowRepeat ? allowRepeat : path.filter(point => point.id === id).length === 0)) {
            this.setState(prevState => {
                return (
                    {
                        path: [...prevState.path, {
                            id,
                            x,
                            y
                        }],
                        lastVisitedPointID: id
                    }
                )
            })
        } else {
            this.setState({
                currentPoint: {x, y}
            })
        }
    };

    displayLines = () => {
        const {path, currentPoint} = this.state;
        const lines = [];
        for (let i = 1; i < path.length; i++) {
            const p1 = path[i - 1];
            const p2 = path[i];
            this.insertLine(p1, p2, i, lines);
        }

        if (currentPoint && path.length > 0) {
            this.insertLine(path[path.length - 1], currentPoint, -1, lines);
        }

        return lines;
    };

    insertLine = (p1, p2, key, lines) => {
        const {patternLinesHeight, patternLinesBackgroundColor, patternDotsRadius} = this.props;
        const lineLengthAngle = getLengthAngle(p1.x, p2.x, p1.y, p2.y);
        lines.push(
            <div key={key} className="pattern-lines"
                 style={
                     {
                         left: p1.x,
                         top: p1.y,
                         width: lineLengthAngle.length + patternDotsRadius * 2,
                         transform: `rotate(${lineLengthAngle.angle}deg)`,
                         height: patternLinesHeight,
                         borderRadius: patternLinesHeight / 2,
                         transformOrigin: `${patternLinesHeight / 2}px ${patternLinesHeight / 2}px`,
                         backgroundColor: patternLinesBackgroundColor
                     }
                 }
            />
        )
    };

    reset = () => {
        const offset = this.patternHolder.current.getBoundingClientRect();

        this.setState({
            path: [],
            currentPoint: null,
            lastVisitedPointID: null,
            offsetTop: offset.top,
            offsetLeft: offset.left
        })
    };

    render() {
        const {
            matrix,
            patternCircleRadius,
            patternCircleMargin,
            backgroundColor,
            patternDotsRadius,
            patternDotsBackgroundColor
        } = this.props;
        const {path} = this.state;
        return (
            <div className="pattern-holder"
                 ref={this.patternHolder}
                 onTouchStart={this._onStart}
                 onMouseDown={this._onStart}
                 style={
                     {
                         width: (patternCircleRadius + patternCircleMargin) * 2 * matrix[1],
                         height: (patternCircleRadius + patternCircleMargin) * 2 * matrix[0],
                         backgroundColor: backgroundColor
                     }
                 }>
                <div className="pattern-wrapper">
                    {Array.from(Array(matrix[0] * matrix[1])).map((item, index) => {
                        const {patternCircleVisible, patternCircleVisibleBorder, patternCircleHoverBorder, patternCircleHoverVisible} = this.props;
                        const patternCircleStyle = {
                            width: patternCircleRadius * 2,
                            height: patternCircleRadius * 2,
                            margin: patternCircleMargin,
                            borderRadius: patternCircleRadius
                        };
                        if (patternCircleVisible) {
                            patternCircleStyle.border = patternCircleVisibleBorder;
                        }
                        if (patternCircleHoverVisible && !(path.filter(point => parseInt(point.id) === index).length === 0)) {
                            patternCircleStyle.border = patternCircleHoverBorder;
                        }
                        return (
                            <div className="pattern-circle"
                                 key={index}
                                 id={index}
                                 style={patternCircleStyle}>
                                <div className="pattern-dots"
                                     style={
                                         {
                                             width: patternDotsRadius * 2,
                                             height: patternDotsRadius * 2,
                                             borderRadius: patternDotsRadius,
                                             marginTop: `-${patternDotsRadius}px`,
                                             marginLeft: `-${patternDotsRadius}px`,
                                             backgroundColor: patternDotsBackgroundColor
                                         }
                                     }
                                />
                            </div>
                        )
                    })}
                </div>
                {this.displayLines()}
            </div>
        )
    }
}

AdPatternLock.defaultProps = {
    matrix: [3, 3],
    backgroundColor: "#556b2f",
    allowRepeat: false,
    delimeter: "",
    patternDotsBackgroundColor: "#fff",
    patternDotsRadius: 5,
    patternCircleRadius: 25,
    patternCircleMargin: 20,
    patternCircleVisible: false,
    patternCircleVisibleBorder: "3px solid #fff",
    patternCircleHoverVisible: false,
    patternCircleHoverBorder: "3px solid #afeeee",
    patternLinesHeight: 10,
    patternLinesBackgroundColor: 'rgba(255,255,255,.7)',
    minimumPatternLength: 2
};

export default AdPatternLock;


