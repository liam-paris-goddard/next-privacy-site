import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'dropdown-menu-links',
  styleUrl: 'dropdown-menu-links.css',
  shadow: true
})
export class MenuLinks {
  @Prop() item: any;

  render() {
    return (
      <div class="gsi-menu-links col">
        {this.item.children.map(child => (
          <div key={child.title}>
            <h3>{this.item.title}</h3>
            {child.children.map(subChild => <a key={subChild.title} href={subChild.link} class="dropdown-item">{subChild.title}</a>)}
          </div>
        ))}
      </div>
    );
  }
}
