$(document).ready(function() {
    const DATA = {
        'Yêu em bất chấp': {
            suat_chieu: { '17h – 20h': 55000 },
            phong_chieu: { 'Vàng': 1.5 },
            ghe: ['Ghế 01', 'Ghế 02', 'Ghế 03', 'Ghế 04', 'Ghế 05']
        },
        'Tháng năm rực rỡ': {
            suat_chieu: { '13h – 16h': 45000 },
            phong_chieu: { 'Bạc': 1.2 },
            ghe: ['Ghế 10', 'Ghế 11', 'Ghế 12']
        },
        'Và em sẽ đến': {
            suat_chieu: { '17h – 20h': 55000 },
            phong_chieu: { 'Kim Cương': 2.0 },
            ghe: ['Ghế VIP A1', 'Ghế VIP A2']
        },
        'Chuyện ma lúc 3 giờ sáng': {
            suat_chieu: { '22h – 2h': 35000 },
            phong_chieu: { 'Đồng': 1.0 },
            ghe: ['Ghế Z1', 'Ghế Z2', 'Ghế Z3', 'Ghế Z4']
        }
    };

    // Cho phép chọn nhiều ghế
    $('#chonChoNgoi').attr('multiple', true).attr('size', 6);

    function populateDropdowns() {
        const $phim = $('#phim');
        $phim.empty().append('<option value="">Chọn Phim</option>');
        $.each(DATA, function(phimName) {
            $phim.append($('<option>', { value: phimName, text: phimName }));
        });
        $('#suatChieu').empty().append('<option value="">Suất chiếu</option>');
        $('#phongChieu').empty().append('<option value="">Phòng chiếu</option>');
        $('#chonChoNgoi').empty();
    }

    $('#phim').on('change', function() {
        const selectedPhim = $(this).val();
        const $suatChieu = $('#suatChieu');
        const $phongChieu = $('#phongChieu');
        const $chonChoNgoi = $('#chonChoNgoi');

        $suatChieu.empty().append('<option value="">Suất chiếu</option>');
        $phongChieu.empty().append('<option value="">Phòng chiếu</option>');
        $chonChoNgoi.empty();

        if (selectedPhim) {
            const phimData = DATA[selectedPhim];
            $.each(phimData.suat_chieu, function(time, price) {
                $suatChieu.append($('<option>', {
                    value: String(price),
                    text: `${time} (${price.toLocaleString('vi-VN')} đ)`
                }));
            });
            $.each(phimData.phong_chieu, function(room, factor) {
                $phongChieu.append($('<option>', {
                    value: String(factor),
                    text: `${room} (x${factor})`
                }));
            });
            $.each(phimData.ghe, function(_, ghe) {
                $chonChoNgoi.append($('<option>', { value: ghe, text: ghe }));
            });
        }
    });

    $('#buyTicketForm').on('submit', function(e) {
        e.preventDefault();

        const ngayChieu = $('#ngayChieu').val();
        const phim = $('#phim').val();
        const suatChieuText = $('#suatChieu option:selected').text().split('(')[0].trim();
        const suatChieuPrice = parseFloat($('#suatChieu').val());
        const phongChieuText = $('#phongChieu option:selected').text().split('(')[0].trim();
        const phongChieuFactor = parseFloat($('#phongChieu').val());
        let selectedSeats = $('#chonChoNgoi').val();

        if (!selectedSeats) selectedSeats = [];
        else if (typeof selectedSeats === 'string') selectedSeats = [selectedSeats];

        if (!phim || Number.isNaN(suatChieuPrice) || Number.isNaN(phongChieuFactor) || selectedSeats.length === 0) {
            alert('Vui lòng chọn đầy đủ thông tin (Phim, Suất chiếu, Phòng chiếu và ít nhất một Chỗ ngồi).');
            return;
        }

        const ticketPricePerSeat = suatChieuPrice * phongChieuFactor;
        const totalAmount = ticketPricePerSeat * selectedSeats.length;

        let seatRowsHtml = '';
        selectedSeats.forEach(function(seat) {
            seatRowsHtml += `
                <tr>
                    <td>${seat}</td>
                    <td>${ticketPricePerSeat.toLocaleString('vi-VN')} đ</td>
                </tr>
            `;
        });

        const infoHtml = `
            <table class="ticket-info-table">
                <thead>
                    <tr><th colspan="2" style="text-align: center;">Thông tin vé</th></tr>
                </thead>
                <tbody>
                    <tr><td>Khách hàng</td><td>Nguyễn Văn A</td></tr>
                    <tr><td>Ngày chiếu</td><td>${ngayChieu}</td></tr>
                    <tr><td>Phim</td><td>${phim}</td></tr>
                    <tr><td>Suất chiếu</td><td>${suatChieuText}</td></tr>
                    <tr><td>Phòng chiếu</td><td>${phongChieuText}</td></tr>
                    <tr><td colspan="2" style="font-weight: bold; text-align: center;">Ghế và Giá Vé</td></tr>
                </tbody>
                <tbody>${seatRowsHtml}</tbody>
                <tfoot>
                    <tr class="total-row">
                        <td>Tổng tiền</td>
                        <td>${totalAmount.toLocaleString('vi-VN')} đ</td>
                    </tr>
                </tfoot>
            </table>
        `;

        $('#ticketInfoOutput').html(infoHtml);
        $('.ticket-info-container').show();

        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <title>Thông tin vé</title>
                <style>
                    .ticket-info-table { width: 400px; border-collapse: collapse; margin: 20px; }
                    .ticket-info-table th, .ticket-info-table td { border: 1px solid #000; padding: 8px; text-align: left; }
                    .ticket-info-table th { background-color: #f2f2f2; }
                    .ticket-info-table .total-row td { font-weight: bold; }
                </style>
            </head>
            <body>
                <p>Thông tin vé đã xác nhận:</p>
                ${infoHtml}
                <script>window.print();</script>
            </body>
            </html>
        `);
        newWindow.document.close();
    });

    // Khởi tạo mặc định
    populateDropdowns();
    $('#phim').val('Yêu em bất chấp').trigger('change');
    setTimeout(function() {
        $('#suatChieu').val('55000');
        $('#phongChieu').val('1.5');
        $('#chonChoNgoi').val(['Ghế 01', 'Ghế 02']);
    }, 50);
});
