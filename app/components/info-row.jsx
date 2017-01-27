import React from 'react';

export default React.createClass({
	propTypes: {
		infoPairs: React.PropTypes.arrayOf(
			React.PropTypes.shape({
				label: React.PropTypes.node,
				info: React.PropTypes.node
			})
		)
	},
	render: function () {
		var labels = this.props.infoPairs.map((elem, i) => {
			var className;
			if (i === 0) {
				className = 'tl';
			} else if (i === this.props.infoPairs.length - 1) {
				className = 'tr';
			}
			return (
				<td key={i} className={className}>
					{elem.label}
				</td>
			);
		});
		var infos = this.props.infoPairs.map((elem, i) => {
			var className;
			if (i === 0) {
				className = 'tl';
			} else if (i === this.props.infoPairs.length - 1) {
				className = 'tr';
			}
			return (
				<td key={i} className={className}>
					{elem.info}
				</td>
			);
		});
		return (
			<table className="info-row">
				<tbody>
					<tr className="strong">
						{labels}
					</tr>
					<tr>
						{infos}
					</tr>
				</tbody>
			</table>
		);
	}
});
