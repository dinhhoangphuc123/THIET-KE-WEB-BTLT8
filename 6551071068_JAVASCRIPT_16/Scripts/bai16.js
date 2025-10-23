$(document).ready(function(){
    $("#datepicker").datepicker({
        dateFormat: "dd/mm/yy"
    });

    $(".add-row").click(function(){
        var name = $("#name").val().trim();
        var email = $("#email").val().trim();
        var birthdate = $("#datepicker").val().trim();

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(name === "" || email === "" || birthdate === ""){
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if(!emailPattern.test(email)){
            alert("Email không hợp lệ!");
            return;
        }

        var row = "<tr>" +
                    "<td><input type='checkbox' name='record'></td>" +
                    "<td>" + name + "</td>" +
                    "<td>" + email + "</td>" +
                    "<td>" + birthdate + "</td>" +
                  "</tr>";
        $("table tbody").append(row);

        $("#name").val("");
        $("#email").val("");
        $("#datepicker").val("");
    });

    $(".delete-row").click(function(){
        $("table tbody").find('input[name="record"]:checked').each(function(){
            $(this).closest("tr").remove();
        });
    });
});
