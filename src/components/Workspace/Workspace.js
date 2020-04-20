import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LayoutsTray from '../LayoutsTray/LayoutsTray';
import { currentLayout } from '../../actions';
import SVGWorkspace from '../SVGWorkspace/SVGWorkspace';
import styled from 'styled-components';


const Styles = styled.div`
    .workSpaceContainer {
        width: 100%;
        height: 100vh;
        display: flex;
    }
`

const Workspace = () => {
    const dispatch = useDispatch();
    const layout = useSelector(state => state.currentLayout);
    const userLayouts = useSelector(state => state.layouts);
    const currentLayoutId = useSelector(state => state.selectedLayoutId);
    const currentDeletedLayoutId = useSelector(state => state.deletedLayoutId);

    useEffect(() => {
        if (userLayouts.length > 0) {
            if (userLayouts !== 'undefined' && currentLayoutId && currentLayoutId !== currentDeletedLayoutId) {
                try {
                    const removedUndefined = userLayouts.filter(layout => layout);
                    dispatch(currentLayout(removedUndefined.filter(layout => layout.layoutId === currentLayoutId)[0]));
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
    }, [userLayouts]);

    useEffect(() => {
        if (userLayouts.length > 0) {
            try {
                dispatch(currentLayout(userLayouts.filter(layout => layout.layoutId === currentLayoutId)[0]));
            } catch (error) {
                console.error(error);
            }
        }
    }, [currentLayoutId]);

    return (
        <Styles>
            <div className='workSpaceContainer'>
                <SVGWorkspace layout={layout} />
                <LayoutsTray />
            </div>
        </Styles>
    )
}

export default Workspace;