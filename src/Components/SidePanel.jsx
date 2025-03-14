const SidePanel = ({ selectedGroups, onToggleGroup, groups }) => {
    return (
        <div className="side-panel-container">
            <div className="side-panel-header">
                <h3 className="side-panel-title">Categories</h3>
                <hr className="title-separator" />
            </div>
            <div className="side-panel-content">
                {groups.map((group) => (
                    <label key={group} className="side-panel-item">
                        {group}
                        <input
                            type="checkbox"
                            checked={selectedGroups.has(group)}
                            onChange={() => onToggleGroup(group)}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
};

export default SidePanel;
