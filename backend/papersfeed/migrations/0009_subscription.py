# Generated by Django 2.2.5 on 2019-11-27 03:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('papersfeed', '0008_auto_20191126_1220'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recipient_user_id', models.IntegerField()),
                ('verb', models.CharField(max_length=255)),
                ('action_object_object_id', models.CharField(blank=True, max_length=255, null=True)),
                ('target_object_id', models.CharField(blank=True, max_length=255, null=True)),
                ('timestamp', models.DateTimeField(auto_now=True)),
                ('action_object_content_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='subscribe_action_object', to='contenttypes.ContentType')),
                ('actor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subscribe_actor', to=settings.AUTH_USER_MODEL)),
                ('target_content_type', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='subscribe_target', to='contenttypes.ContentType')),
            ],
            options={
                'db_table': 'swpp_subscription',
                'ordering': ('-timestamp',),
            },
        ),
    ]
