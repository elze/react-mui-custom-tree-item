import './App.css';
import React from 'react';
import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';

import { Box } from '@mui/system';
//import Container from '@mui/material/Container';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons'
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'


import PropTypes from 'prop-types';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem, { useTreeItem } from '@mui/lab/TreeItem';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';

import { useMatomo } from '@datapunt/matomo-tracker-react'

const useStyles = makeStyles({
	root: {
		margin: "5px 5px 5px 5px",
		width: "auto"		
	},
	label: {
		backgroundColor: "#FFEFD5",
		borderRadius: "10px",
		padding: "5px 5px 5px 5px",
		textAlign: "center",
		width: "250px"
	},
	content: {
		padding: "10px 10px 10px 10px",
		backgroundColor: "white",
		width: "250px"
	},
	expanded: {
		backgroundColor: "white"
	},
	labelWithPercentage: {
		backgroundColor: "#d4fbfc",
		borderRadius: "10px",
		display: "inline-block",
		padding: "5px 5px 5px 5px",
		textAlign: "center",
		width: "auto"
	},
	leafRoot: {
		display: "inline-block",
		width: "auto"
	},
	leafContent: {
		display: "inline-block",
		padding: "10px 10px 10px 10px",
		width: "auto"

	},
	selected: { 
		backgroundColor: "#adc9e6"
	}
});

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
	children,
	treeItemData
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);
  const { trackPageView, trackEvent } = useMatomo();
  const icon = iconProp || expansionIcon || displayIcon;
  const faIcon = children && children.length > 0 ? "<FontAwesomeIcon icon={faAngleDoubleRight} />" : ""

  //console.log(`CustomContent: treeItemData = ${treeItemData}`);
  let itemText = "";
  let percentageText = "";
  if (treeItemData) {
	  //console.log(`CustomContent: treeItemData.item = ${treeItemData.item}`);
	  itemText = treeItemData.item;
	  if (treeItemData.percentOfTime) {
		  percentageText = treeItemData.percentOfTime;
	  }
  }
  else {
	itemText = label;
  }

  const handleExpansionClick = (event) => {
	trackEvent({ category: `Node expanded or collapsed in handleExpansionClick`, action: itemText });
	//console.log("handleExpansionClick");
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
	trackEvent({ category: `Node expanded or collapsed in handleSelectionClick`, action: itemText });
	//console.log("handleSelectionClick");
    handleSelection(event);
  };
  
  return (
    // eslint-disable-next-line 
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}      
	  onClick={preventSelection}		
      ref={ref}
    >
      {/* eslint-disable-next-line */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
		  { 
		  children && children.length > 0 ? 
			expanded ? <FontAwesomeIcon icon={faAngleDoubleDown} /> 
			: <FontAwesomeIcon icon={faAngleDoubleRight} /> 
		  : <span/>
		  }
	  </div>		
	  <Typography onClick={handleSelection} component="div" className={classes.label}>{itemText}<br/> <span className="skillPercentage">{percentageText}</span> </Typography>
    </div>
  );
});

CustomContent.propTypes = {
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object.isRequired,
  /**
   * className applied to the root element.
   */
  className: PropTypes.string,
  /**
   * The icon to display next to the tree node's label. Either a parent or end icon.
   */
  displayIcon: PropTypes.node,
  /**
   * The icon to display next to the tree node's label. Either an expansion or collapse icon.
   */
  expansionIcon: PropTypes.node,
  /**
   * The icon to display next to the tree node's label.
   */
  icon: PropTypes.node,
  /**
   * The tree node label.
   */
  label: PropTypes.node,
  /**
   * The id of the node.
   */
  nodeId: PropTypes.string.isRequired,
  children: PropTypes.array,
  treeItemData: PropTypes.any
};

const CustomTreeItem = (props) => (
  <TreeItem ContentComponent={CustomContent} {...props} />
);

const getTreeItemsFromData = (treeItems) => {
	if (treeItems) {		
	  return treeItems.map(treeItemData => {
		let children = undefined;
		if (treeItemData.successors && treeItemData.successors.length > 0) {
		  children = getTreeItemsFromData(treeItemData.successors);
		}		  		
		let nodeLabel = treeItemData.item;
		if (treeItemData.percentOfTime) 
			nodeLabel = `${treeItemData.item} ${treeItemData.percentOfTime}`;
		const classes = useStyles();
		// eslint-disable-next-line no-unused-vars
		return (
      <CustomTreeItem	  
		classes={{
		//root: 'tree-item-root',
		root: children ? classes.root : classes.leafRoot,
		//label: classes.label, // 'tree-item-label',  
		label: children ? classes.label : classes.labelWithPercentage,
		content: children ? classes.content : classes.leafContent, // 'tree-item-content',
		//content: classes.content,
		expanded: classes.expanded, // 'tree-item-expanded',
		//selected: 'tree-item-selected'
		selected: classes.selected
		}}		  
		key={treeItemData.id}
		nodeId={treeItemData.id.toString()}    		
		children={children}		
		ContentProps={{
		treeItemData: treeItemData,
		children: children
		}}
      ></CustomTreeItem>
		);
	  });
	}
};

const DataTreeView = ({treeItems}) => {
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
	  {getTreeItemsFromData(treeItems)}
    </TreeView>
  );
};

export default function App() {
	
	const [skills, setSkills] = useState(null);
	const { trackPageView, trackEvent } = useMatomo();	
	const classes = useStyles();

	useEffect(() => {    
		async function getSkills() {
			const response = await fetch('https://sc2019.skillclusters.com/sc/structskills');
			const skillsFromServer = await response.json();
			if (response.status !== 200) {
				trackEvent({ category: `https://sc2019.skillclusters.com/sc/structskills retrieval error`, action: skillsFromServer.message });
				throw Error(skillsFromServer.message);
			}
			console.log(`getSkills`);
			trackPageView({
			  documentTitle: `SC TreeView CustomContent Material: skills loaded `, // optional
			  //href: `http://localhost:3000`, // optional
			  href: `https://react-mui-custom-tree-item-elze.vercel.app`,
			});	 				
			setSkills(skillsFromServer);
		}
		console.log(`useEffect is running`);

		getSkills();
		return () => {
			console.log('useEffect return');
		};

	}, [trackPageView, trackEvent]);		
  return (
  <>
	<Box sx={{ fontFamily: 'Verdana, sans-serif' }}>
		<p>This React.js app uses React MUI (Material UI) library (https://mui.com/) to display a tree view of data. The appearance of the tree nodes is customized in their appearance, and their content is generated programmatically. </p>

		<p>The data displayed in the tree doesn't make much sense and has little to do with this project; it's borrowed from another, unrelated experiment of mine.</p>

		<p>Here is <a href="https://github.com/elze/react-mui-custom-tree-item">the source code</a>. Here is <a href="http://geekitude.com">the author's website</a>.</p>      
	</Box>
	<DataTreeView treeItems={skills} />
  </>
  );
}
