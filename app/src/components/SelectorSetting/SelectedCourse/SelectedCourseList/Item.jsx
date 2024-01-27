import {Component} from "react";
import styled from "styled-components";
import {Form, OverlayTrigger, Popover, Stack} from "react-bootstrap";

const CourseRow = styled.div`
    font-size: 12px;
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
    background-color: #fafafa;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const CourseInfo = styled.div`
    flex: 1;
    text-align: center;
    overflow: hidden;
    text-overflow: fade;

    &:last-child {
        margin-right: 0;
    }
`;

const SmallCourseInfo = styled(CourseInfo)`
    flex: 0.4;
`;

const TinyCourseInfo = styled(CourseInfo)`
    flex: 0.25;
`;

const Tag = styled.div`
    background-color: #eef;
    border: 1px solid #ddf;
    border-radius: 4px;
    padding: 2px 5px;
    margin: 2px;
    font-size: 10px;
`;

const StyledLink = styled.a`
    display: inline-block;
    text-decoration: none;
    color: black;

    &:hover {
        text-decoration: underline;
    }
`;

const StyledPopover = styled(Popover)`
    &.popover {
        max-width: 400px;
    }
`;

class Item extends Component {
    state = {
        showPopover: false,
        placement: window.innerWidth < 992 ? 'bottom' : 'left',
    };

    infoCells = {
        "名額": "Restrict",
        "點選": "Select",
        "選上": "Selected",
        "餘額": "Remaining",
        "備註": "Context",
    }

    /**
     * 處理畫面尺寸變化
     */
    handleResize = () => {
        const newPlacement = window.innerWidth < 992 ? 'bottom' : 'left';
        this.setState({placement: newPlacement});
    };

    /**
     * 註冊畫面尺寸變化事件
     */
    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    /**
     * 取消註冊畫面尺寸變化事件
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    /**
     * 處理課程選取
     */
    handleCourseSelect = () => {
        this.props.onCourseSelect(this.props.course, !this.props.isSelected);
    }

    /**
     * 處理彈出視窗顯示
     * @param show
     */
    handleTogglePopover = (show) => {
        this.setState({showPopover: show});
    };

    /**
     * 處理課程權重變化
     * @param event
     */
    handleCourseWeightChange = (event) => {
        this.props.onCourseWeightChange(this.props.course, event.target.value);
    }

    /**
     * 渲染彈出視窗
     * @returns {JSX.Element}
     */
    renderPopover = () => {
        const {course} = this.props;
        return (
            <>
                <Popover.Header as="h3"><span className="fw-bolder">{course['Name']}</span> {course['Number']}
                </Popover.Header>
                <Popover.Body>
                    <Stack direction="horizontal" gap={1}>
                        {Object.entries(this.infoCells).map(([displayName, courseKey]) => (
                            <Stack key={displayName} className="bg-body-secondary p-1 rounded-2 text-center">
                                <div className="fw-bolder">{displayName}</div>
                                <div>{course[courseKey]}</div>
                            </Stack>
                        ))}
                    </Stack>
                </Popover.Body>
            </>
        );
    }

    render() {
        const {
            course,
            isConflict,
            isSelected,
            isHovered,
            onCourseHover,
            isCollapsed,
            courseWeight,
        } = this.props;
        const {
            showPopover,
            placement
        } = this.state;

        if (!course) return null;

        // 處理時間欄位，改成繁體中文
        const days = {
            'Monday': '一',
            'Tuesday': '二',
            'Wednesday': '三',
            'Thursday': '四',
            'Friday': '五',
            'Saturday': '六',
            'Sunday': '日'
        };
        const time = Object.keys(days)
            .map(day => course[day] ? <Tag key={day}>{days[day]} {course[day]}</Tag> : null)
            .filter(tag => tag !== null);

        // 處理全英課程
        const emi = (
            <Tag className={course['EMI'] === '1' ? 'bg-danger text-white' : 'bg-transparent border-0'}>
                {course['EMI'] === '1' ? '是' : '否'}
            </Tag>
        )

        // 處理課程連結
        const courseName = (
            <StyledLink href={course['Url']} target="_blank" rel="noopener noreferrer">
                {course['Name']}
            </StyledLink>
        )

        const courseNumber = course['Number'];

        return (
            <CourseRow
                className={isConflict && !isSelected ? 'bg-warning-subtle' : isHovered ? 'bg-success-subtle' : ''}
                onMouseEnter={() => onCourseHover(course['Number'])}
                onMouseLeave={() => onCourseHover(null)}
            >
                <TinyCourseInfo>
                    <OverlayTrigger
                        trigger={['hover', 'focus']}
                        placement={isCollapsed ? 'bottom' : placement}
                        overlay={
                            <StyledPopover id={`pop-info-${course["Name"]}`}>
                                {showPopover ? this.renderPopover() : <></>}
                            </StyledPopover>
                        }
                        onToggle={(show) => this.handleTogglePopover(show)}
                    >
                        <Form.Check
                            id={`all-course-${course['Number']}`}
                            aria-label="option 1"
                            checked={this.props.isSelected}
                            onChange={this.handleCourseSelect}/>
                    </OverlayTrigger>
                </TinyCourseInfo>
                <CourseInfo>{courseName} ({courseNumber})</CourseInfo>
                <SmallCourseInfo>{course['Department']}</SmallCourseInfo>
                <SmallCourseInfo>{time}</SmallCourseInfo>
                <TinyCourseInfo>{emi}</TinyCourseInfo>
                <SmallCourseInfo>
                    <Form.Control
                        id={`course-weight-${course['Number']}`}
                        size="sm"
                        type="number"
                        min={0}
                        max={100}
                        value={courseWeight}
                        onChange={this.handleCourseWeightChange}/>
                </SmallCourseInfo>
            </CourseRow>
        );
    }
}

export default Item;
