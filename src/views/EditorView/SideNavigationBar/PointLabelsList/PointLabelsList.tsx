import React from 'react';
import {ISize} from "../../../../interfaces/ISize";
import Scrollbars from 'react-custom-scrollbars';
import {ImageData, LabelPoint} from "../../../../store/labels/types";
import './PointLabelsList.scss';
import {
    updateActiveLabelId,
    updateActiveLabelNameIndex,
    updateImageDataById
} from "../../../../store/labels/actionCreators";
import {AppState} from "../../../../store";
import {connect} from "react-redux";
import LabelInputField from "../LabelInputField/LabelInputField";
import EmptyLabelList from "../EmptyLabelList/EmptyLabelList";
import {LabelActions} from "../../../../logic/actions/LabelActions";

interface IProps {
    size: ISize;
    imageData: ImageData;
    updateImageDataById: (id: string, newImageData: ImageData) => any;
    activeLabelIndex: number;
    activeLabelId: string;
    highlightedLabelId: string;
    updateActiveLabelNameIndex: (activeLabelIndex: number) => any;
    labelNames: string[];
    updateActiveLabelId: (activeLabelId: string) => any;
}

const PointLabelsList: React.FC<IProps> = ({size, imageData, updateImageDataById, labelNames, updateActiveLabelNameIndex, activeLabelId, highlightedLabelId, updateActiveLabelId}) => {
    const labelInputFieldHeight = 40;
    const listStyle: React.CSSProperties = {
        width: size.width,
        height: size.height
    };
    const listStyleContent: React.CSSProperties = {
        width: size.width,
        height: imageData.labelPoints.length * labelInputFieldHeight
    };

    const deletePointLabelById = (labelPointId: string) => {
        LabelActions.deletePointLabelById(imageData.id, labelPointId);
    };

    const updatePointLabel = (labelPointId: string, labelNameIndex: number) => {
        const newImageData = {
            ...imageData,
            labelPoints: imageData.labelPoints.map((labelPoint: LabelPoint) => {
                if (labelPoint.id === labelPointId) {
                    return {
                        ...labelPoint,
                        labelIndex: labelNameIndex
                    }
                }
                return labelPoint
            })
        };
        updateImageDataById(imageData.id, newImageData);
        updateActiveLabelNameIndex(labelNameIndex);
    };

    const onClickHandler = () => {
        updateActiveLabelId(null);
    };

    const getChildren = () => {
        return imageData.labelPoints.map((labelPoint: LabelPoint) => {
            return <LabelInputField
                size={{
                    width: size.width,
                    height: labelInputFieldHeight
                }}
                isActive={labelPoint.id === activeLabelId}
                isHighlighted={labelPoint.id === highlightedLabelId}
                id={labelPoint.id}
                key={labelPoint.id}
                onDelete={deletePointLabelById}
                value={labelPoint.labelIndex !== null ? labelNames[labelPoint.labelIndex] : null}
                options={labelNames}
                onSelectLabel={updatePointLabel}
            />
        });
    };

    return (
        <div
            className="PointLabelsList"
            style={listStyle}
            onClickCapture={onClickHandler}
        >
            {imageData.labelPoints.length === 0 ?
                <EmptyLabelList
                    labelBefore={"Mark the first point"}
                    labelAfter={"No labels created for this image"}
                /> :
                <Scrollbars>
                    <div
                        className="PointLabelsListContent"
                        style={listStyleContent}
                    >
                        {getChildren()}
                    </div>
                </Scrollbars>
            }
        </div>
    );
};

const mapDispatchToProps = {
    updateImageDataById,
    updateActiveLabelNameIndex,
    updateActiveLabelId
};

const mapStateToProps = (state: AppState) => ({
    activeLabelIndex: state.labels.activeLabelNameIndex,
    activeLabelId: state.labels.activeLabelId,
    highlightedLabelId: state.labels.highlightedLabelId,
    labelNames : state.labels.labelNames
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PointLabelsList);