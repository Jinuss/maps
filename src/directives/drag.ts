export const drag = {
    mounted(el: { style: { position: string; cursor: string; left: string; top: string; }; offsetLeft: any; offsetTop: any; offsetWidth: number; offsetHeight: number; addEventListener: (arg0: string, arg1: (e: any) => void) => void; }) {
        el.style.position = 'absolute';
        el.style.cursor = 'move';

        let startX: number, startY: number, initialX: number, initialY: number;

        const dragStart = (e: { clientX: number; clientY: number; }) => {
            startX = e.clientX;
            startY = e.clientY;
            initialX = el.offsetLeft;
            initialY = el.offsetTop;

            document.addEventListener('mousemove', dragMove);
            document.addEventListener('mouseup', dragEnd);
        };

        const dragMove = (e: { clientX: number; clientY: number; }) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const newX = initialX + dx;
            const newY = initialY + dy;
      
            const maxX = window.innerWidth - el.offsetWidth;
            const maxY = window.innerHeight - el.offsetHeight;
      
            el.style.left = `${Math.min(Math.max(newX, 0), maxX)}px`;
            el.style.top = `${Math.min(Math.max(newY, 0), maxY)}px`;
        };

        const dragEnd = () => {
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
        };

        el.addEventListener('mousedown', dragStart);
    }
};
